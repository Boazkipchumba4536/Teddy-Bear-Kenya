/**
 * Fetches public product JSON from littleteddyshop.com (Shopify).
 * Saves only fields present in the API — no guessed attributes.
 * Run: node scripts/fetch-littleteddy-catalog.mjs
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../data/littleteddy-catalog.json");
// Bulk collection JSON is often disabled; use per-product .json in enrich-catalog-images.mjs
const SOURCES = [
  "https://littleteddyshop.com/collections/all-items/products.json",
  "https://littleteddyshop.com/products.json",
];

function stripHtml(html) {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchAll() {
  const all = [];
  let sourceBase = SOURCES[0];
  for (const tryUrl of SOURCES) {
    const probe = await fetch(`${tryUrl}?limit=1`);
    if (probe.ok) {
      sourceBase = tryUrl;
      break;
    }
  }
  for (let page = 1; page <= 10; page++) {
    const url = `${sourceBase}?limit=250&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} for page ${page} (${sourceBase})`);
    const json = await res.json();
    const batch = json.products ?? [];
    if (!batch.length) break;
    all.push(...batch);
    console.log(`Page ${page}: ${batch.length} products (total ${all.length})`);
    if (batch.length < 250) break;
  }
  return all;
}

function normalize(shopify) {
  const title = shopify.title?.trim();
  const brand = shopify.vendor?.trim();
  const handle = shopify.handle?.trim();
  if (!title || !brand || !handle) return null;

  const variants = shopify.variants ?? [];
  const prices = [
    ...new Set(
      variants
        .map((v) => parseFloat(v.price))
        .filter((n) => Number.isFinite(n) && n > 0)
    ),
  ];
  if (prices.length !== 1) return null;

  const inStock = variants.some((v) => v.available === true);
  const plainDescription = stripHtml(shopify.body_html);
  const imageUrls = (shopify.images ?? [])
    .map((im) => im.src?.trim())
    .filter(Boolean);
  const imageUrl = imageUrls[0] || null;
  const tags = Array.isArray(shopify.tags)
    ? shopify.tags
    : typeof shopify.tags === "string"
      ? shopify.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

  return {
    sourceHandle: handle,
    name: title,
    brand,
    priceEur: prices[0],
    inStock,
    productType: shopify.product_type?.trim() || "",
    tags,
    description: plainDescription || null,
    imageUrl,
    imageUrls,
    publishedAt: shopify.published_at || null,
  };
}

const raw = await fetchAll();
const normalized = raw.map(normalize).filter(Boolean);
const skipped = raw.length - normalized.length;

const payload = {
  fetchedAt: new Date().toISOString(),
  sourceUrl: "https://littleteddyshop.com/collections/all-items",
  totalFetched: raw.length,
  totalIncluded: normalized.length,
  totalSkipped: skipped,
  products: normalized,
};

writeFileSync(OUT, JSON.stringify(payload, null, 2), "utf8");
console.log(`\nSaved ${normalized.length} products to data/littleteddy-catalog.json (${skipped} skipped — unclear price or missing name/brand)`);
console.log("Next: npm run catalog:enrich-images  (Shopify product photos)");
console.log("Then: npm run catalog:import");
