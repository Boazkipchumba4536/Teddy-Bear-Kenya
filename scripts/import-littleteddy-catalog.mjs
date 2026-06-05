/**
 * Imports littleteddy-catalog.json into Supabase products.
 * Uses teddybearhaven.co.ke CDN images (not third-party shop URLs).
 * KES prices: EUR × 140, rounded to nearest KSh 100 (configure in script).
 *
 * Run migrations/005_product_brand_stock.sql in Supabase first.
 * Run: node scripts/fetch-littleteddy-catalog.mjs && node scripts/import-littleteddy-catalog.mjs
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const CATALOG = resolve(root, "data/littleteddy-catalog.json");

/** Documented EUR→KES reference rate for listing conversion only */
const EUR_TO_KES = 140;

const OCCASIONS = [
  "Valentine's",
  "Birthday",
  "Anniversary",
  "Baby Shower",
  "Get Well",
  "Just Because",
];
const SIZES = ["S", "M", "L", "Giant"];
const COLORS = ["Brown", "White", "Pink", "Grey", "Custom"];
const CDN = "https://teddybearhaven.co.ke/wp-content/uploads";
const PRODUCT_IMAGES = {
  1: `${CDN}/2025/01/Customized-teddy-bear-Gifts-for-her.jpg`,
  2: `${CDN}/2026/02/Everyday-Joy-Teddy-Bear-cream-white.jpeg`,
  3: `${CDN}/2026/02/medium-70cm-brown-teddy-bear.jpeg`,
  4: `${CDN}/2026/02/big-teddy-bear-brown-hug-me.jpeg`,
  5: `${CDN}/2026/02/giant-purple-teddy-bear.jpeg`,
  6: `${CDN}/2026/02/Everyday-Joy-Teddy-Bear-pink.jpeg`,
  7: `${CDN}/2024/01/cute-panda-teddy-140cm.webp`,
  8: `${CDN}/2024/12/65cm-big-blue-sitting-teddy-bear.webp`,
  9: `${CDN}/2025/01/Buy-Big-Teddy-Bear-Dolls-online-130cm-Giant-Teddy-Bear-in-Pink-and-White-front.jpg`,
  10: `${CDN}/2025/01/Big-Blue-Love-Song-Teddy-Bear-Buy-Teddy-Bear-Dolls-Online.webp`,
  11: `${CDN}/2026/01/big-teddy-bear-brown-cream.jpeg`,
  12: `${CDN}/2025/01/Big-teddy-bear-white-Big-Teddy-Bear-in-Kenya.webp`,
  13: `${CDN}/2024/12/big-white-65cm-teddy-bears.webp`,
  14: `${CDN}/2026/02/med-large-purple-teddy-bear.jpeg`,
  15: `${CDN}/2024/12/lady-holding-65cm-big-blue-teddy-bears.webp`,
  16: `${CDN}/2025/01/Big-teddy-bear-collection-Big-Teddy-Bear-in-Kenya.webp`,
};
const img = (n) => PRODUCT_IMAGES[n] ?? PRODUCT_IMAGES[1];

function parseEnvFile(path) {
  const env = {};
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

function loadEnv() {
  const env = {};
  for (const file of [".env", ".env.local"]) {
    const path = resolve(root, file);
    if (existsSync(path)) Object.assign(env, parseEnvFile(path));
  }
  return env;
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function inferSize(name, description, productType) {
  const t = `${name} ${description} ${productType}`.toLowerCase();
  if (/\b(giant|life[- ]?size|180\s*cm|150\s*cm|120\s*cm)\b/.test(t)) return "Giant";
  if (/\b(100\s*cm|90\s*cm|80\s*cm|70\s*cm|large|xl)\b/.test(t)) return "L";
  if (/\b(small|mini|30\s*cm|35\s*cm|40\s*cm)\b/.test(t)) return "S";
  return "M";
}

function inferColor(name, tags) {
  const t = `${name} ${tags.join(" ")}`.toLowerCase();
  if (/\b(pink|rose|blush|magenta)\b/.test(t)) return "Pink";
  if (/\b(white|cream|ivory|snow)\b/.test(t)) return "White";
  if (/\b(grey|gray|silver)\b/.test(t)) return "Grey";
  if (/\b(brown|chocolate|caramel|mocha|tan)\b/.test(t)) return "Brown";
  return "Brown";
}

function inferOccasions(name, tags, productType) {
  const t = `${name} ${tags.join(" ")} ${productType}`.toLowerCase();
  const out = [];
  if (/\b(valentine|love|heart|romantic)\b/.test(t)) out.push("Valentine's");
  if (/\b(birthday|bday)\b/.test(t)) out.push("Birthday");
  if (/\b(anniversary|wedding)\b/.test(t)) out.push("Anniversary");
  if (/\b(baby shower|new baby|christening)\b/.test(t)) out.push("Baby Shower");
  if (/\b(get well|comfort|sympathy)\b/.test(t)) out.push("Get Well");
  if (!out.length) out.push("Just Because");
  return [...new Set(out)].slice(0, 2);
}

function eurToKes(eur) {
  return Math.max(1500, Math.round((eur * EUR_TO_KES) / 100) * 100);
}

function mapToRow(item, index) {
  const slug = slugify(`lts-${item.sourceHandle}`);
  const imageNum = (index % 16) + 1;
  const fallbackPrimary = img(imageNum);
  const fallbackSecondary = img(((imageNum + 5) % 16) + 1);
  const primary = item.imageUrl || fallbackPrimary;
  const secondary = item.imageUrls?.[1] || fallbackSecondary;
  const size = inferSize(item.name, item.description ?? "", item.productType);
  const color = inferColor(item.name, item.tags);
  const occasions = inferOccasions(item.name, item.tags, item.productType);
  const price = eurToKes(item.priceEur);

  const descParts = [];
  if (item.description) descParts.push(item.description.slice(0, 600));
  else descParts.push(`${item.brand} ${item.name} — premium plush teddy bear.`);
  descParts.push(`Reference price at source: €${item.priceEur.toFixed(2)}.`);

  return {
    slug,
    name: item.name,
    brand: item.brand,
    in_stock: item.inStock,
    tagline: `${item.brand} collection`,
    description: descParts.join(" "),
    care_instructions: "Spot clean with mild detergent. Air dry away from direct sunlight.",
    delivery_info:
      "Same-day delivery in Nairobi for orders before 12PM. Standard delivery 2–3 business days nationwide.",
    price,
    size,
    color,
    occasions,
    image: primary,
    images: [primary, secondary],
    badge: null,
    featured: index % 17 === 0,
    created_at: item.publishedAt
      ? String(item.publishedAt).slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  };
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

if (!existsSync(CATALOG)) {
  console.error("Missing data/littleteddy-catalog.json — run: node scripts/fetch-littleteddy-catalog.mjs");
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

console.log(`Importing ${unique.length} products into Supabase…`);

const { error: delErr } = await admin.from("products").delete().neq("slug", "");
if (delErr) {
  console.warn("Delete existing products:", delErr.message);
  console.warn("If brand/in_stock columns are missing, run supabase/migrations/005_product_brand_stock.sql");
}

function stripExtendedColumns(rows) {
  return rows.map(({ brand, in_stock, ...rest }) => ({
    ...rest,
    tagline: in_stock ? `${brand} collection` : `${brand} collection · Out of stock`,
    description: rest.description,
  }));
}

let payload = unique;
const { error: testErr } = await admin.from("products").insert(payload.slice(0, 1));
if (!testErr) {
  await admin.from("products").delete().eq("slug", payload[0].slug);
} else if (testErr.message?.includes("brand") || testErr.message?.includes("in_stock")) {
  console.warn("brand/in_stock columns missing — run migrations/005_product_brand_stock.sql");
  console.warn("Importing with brand stored in tagline only…");
  payload = stripExtendedColumns(unique);
} else {
  throw new Error(`Schema test insert: ${testErr.message}`);
}

const batchSize = 50;
let inserted = 0;
for (let i = 0; i < payload.length; i += batchSize) {
  const batch = payload.slice(i, i + batchSize);
  const { error } = await admin.from("products").insert(batch);
  if (error) throw new Error(`Insert batch ${i / batchSize + 1}: ${error.message}`);
  inserted += batch.length;
  console.log(`  ${inserted}/${payload.length}`);
}

const brands = [...new Set(unique.map((r) => r.brand))].sort();
console.log("\nDone.");
console.log("Brands:", brands.join(", "));
console.log("In stock:", unique.filter((r) => r.in_stock).length);
console.log("Out of stock:", unique.filter((r) => !r.in_stock).length);
