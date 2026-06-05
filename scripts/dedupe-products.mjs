/**
 * Remove duplicate products from Supabase.
 * Keeps one row per normalized product name (best image, shortest slug, oldest).
 *
 *   node scripts/dedupe-products.mjs          # dry run
 *   node scripts/dedupe-products.mjs --delete # apply
 */

import { readFileSync, existsSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const APPLY = process.argv.includes("--delete");

function parseEnvFile(path) {
  const env = {};
  if (!existsSync(path)) return env;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

function normName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function isPlaceholderImage(url) {
  return !url || url.includes("teddybearhaven.co.ke");
}

/** Lower score = preferred keeper */
function rank(p) {
  let score = 0;
  if (isPlaceholderImage(p.image)) score += 100;
  if (/-\d+$/.test(p.slug)) score += 20;
  if (p.slug.includes("copy")) score += 50;
  score += p.slug.length * 0.01;
  return score;
}

const env = { ...parseEnvFile(resolve(root, ".env")), ...parseEnvFile(resolve(root, ".env.local")) };
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sb = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: products, error } = await sb
  .from("products")
  .select("id, slug, name, image, price, created_at")
  .order("created_at", { ascending: true });

if (error) throw new Error(error.message);

const byName = new Map();
for (const p of products) {
  const key = normName(p.name);
  if (!key || key.length < 2) continue;
  if (!byName.has(key)) byName.set(key, []);
  byName.get(key).push(p);
}

const toRemove = [];
const groups = [];

for (const [name, rows] of byName) {
  if (rows.length < 2) continue;
  const sorted = [...rows].sort(
    (a, b) =>
      rank(a) - rank(b) ||
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  const keeper = sorted[0];
  const dupes = sorted.slice(1);
  groups.push({ name, keeper, dupes });
  toRemove.push(...dupes);
}

console.log(`Products in DB: ${products.length}`);
console.log(`Duplicate name groups: ${groups.length}`);
console.log(`Rows to delete: ${toRemove.length}`);

if (groups.length) {
  console.log("\nDuplicates:");
  for (const g of groups) {
    console.log(`  "${g.name}" → keep ${g.keeper.slug}`);
    for (const d of g.dupes) {
      console.log(`    remove ${d.slug} (${d.price} KSh)`);
    }
  }
}

writeFileSync(
  resolve(root, "data/duplicate-products-report.json"),
  JSON.stringify(
    {
      at: new Date().toISOString(),
      groups: groups.map((g) => ({
        name: g.name,
        keep: { id: g.keeper.id, slug: g.keeper.slug },
        remove: g.dupes.map((d) => ({ id: d.id, slug: d.slug })),
      })),
    },
    null,
    2
  )
);

if (!toRemove.length) {
  console.log("\nNo duplicate products to remove.");
  process.exit(0);
}

if (!APPLY) {
  console.log("\nDry run. To delete duplicates:");
  console.log("  node scripts/dedupe-products.mjs --delete");
  process.exit(0);
}

const ids = toRemove.map((p) => p.id);
for (let i = 0; i < ids.length; i += 50) {
  const batch = ids.slice(i, i + 50);
  const { error: delErr } = await sb.from("products").delete().in("id", batch);
  if (delErr) throw new Error(delErr.message);
}

const { count } = await sb.from("products").select("*", { count: "exact", head: true });
console.log(`\nDeleted ${ids.length} duplicates. Remaining: ${count ?? "?"}`);
