/**
 * Imports data/tambo-catalog.json into Supabase (upsert — keeps existing non-Tambo products).
 * Uses real product images from tamboteddies.com.au.
 *
 * Run: npm run catalog:fetch-tambo && npm run catalog:import-tambo
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import {
  loadEnv,
  slugify,
  inferSize,
  inferColor,
  inferOccasions,
} from "./lib/catalog-shared.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const CATALOG = resolve(root, "data/tambo-catalog.json");

/** Reference AUD→KES rate for storefront listing */
const AUD_TO_KES = 88;
const CDN = "https://teddybearhaven.co.ke/wp-content/uploads";
const FALLBACK_IMAGES = [
  `${CDN}/2026/02/medium-70cm-brown-teddy-bear.jpeg`,
  `${CDN}/2025/01/Big-Blue-Love-Song-Teddy-Bear-Buy-Teddy-Bear-Dolls-Online.webp`,
];

function audToKes(aud) {
  return Math.max(1500, Math.round((aud * AUD_TO_KES) / 100) * 100);
}

function mapToRow(item, index) {
  const slug = slugify(`tambo-${item.sourceSlug}`);
  const primary = item.imageUrl || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  const secondary = item.imageUrls?.[1] || FALLBACK_IMAGES[(index + 1) % FALLBACK_IMAGES.length];
  const size = inferSize(item.name, item.description ?? "", item.productType);
  const color = inferColor(item.name, item.tags);
  const occasions = inferOccasions(item.name, item.tags, item.productType);
  const price = audToKes(item.priceAud);

  const descParts = [];
  if (item.description) descParts.push(item.description.slice(0, 600));
  else descParts.push(`${item.brand} ${item.name} — Australian sheepskin teddy bear.`);
  descParts.push(`Reference price at source: A$${item.priceAud.toFixed(2)} AUD.`);

  return {
    slug,
    name: item.name,
    brand: item.brand,
    in_stock: item.inStock,
    tagline: `${item.brand} collection`,
    description: descParts.join(" "),
    care_instructions:
      "Gently brush sheepskin pile. Spot clean only; do not machine wash. Store in a cool, dry place.",
    delivery_info:
      "Same-day delivery in Nairobi for orders before 12PM. Standard delivery 2–3 business days nationwide.",
    price,
    size,
    color,
    occasions,
    image: primary,
    images: [primary, secondary],
    badge: item.hasOptions ? "New Arrival" : null,
    featured: index % 11 === 0,
    created_at: new Date().toISOString().slice(0, 10),
  };
}

const env = loadEnv(root);
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

if (!existsSync(CATALOG)) {
  console.error("Missing data/tambo-catalog.json — run: npm run catalog:fetch-tambo");
  process.exit(1);
}

const { products } = JSON.parse(readFileSync(CATALOG, "utf8"));
const rows = products.map(mapToRow);
const seen = new Set();
const unique = rows.filter((r) => {
  if (seen.has(r.slug)) return false;
  seen.add(r.slug);
  return true;
});

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

console.log(`Upserting ${unique.length} Tambo products (slug prefix: tambo-)…`);

function stripExtendedColumns(rows) {
  return rows.map(({ brand, in_stock, ...rest }) => ({
    ...rest,
    tagline: in_stock ? `${brand} collection` : `${brand} collection · Out of stock`,
  }));
}

let payload = unique;
const { error: testErr } = await admin.from("products").upsert(payload.slice(0, 1), { onConflict: "slug" });
if (testErr) {
  if (testErr.message?.includes("brand") || testErr.message?.includes("in_stock")) {
    console.warn("brand/in_stock columns missing — storing brand in tagline only");
    payload = stripExtendedColumns(unique);
  } else {
    throw new Error(`Schema test upsert: ${testErr.message}`);
  }
}

const batchSize = 50;
let done = 0;
for (let i = 0; i < payload.length; i += batchSize) {
  const batch = payload.slice(i, i + batchSize);
  const { error } = await admin.from("products").upsert(batch, { onConflict: "slug" });
  if (error) throw new Error(`Upsert batch ${i / batchSize + 1}: ${error.message}`);
  done += batch.length;
  console.log(`  ${done}/${payload.length}`);
}

const { count } = await admin
  .from("products")
  .select("*", { count: "exact", head: true });

console.log("\nDone.");
console.log("Tambo in stock:", unique.filter((r) => r.in_stock).length);
console.log("Total products in database:", count ?? "?");
