/**
 * Adds imageUrl / imageUrls to littleteddy-catalog.json via per-product Shopify JSON.
 * (Collection products.json is disabled on littleteddyshop.com.)
 * Run: npm run catalog:enrich-images
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CATALOG = resolve(__dirname, "../data/littleteddy-catalog.json");
const DELAY_MS = 120;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchProductImages(handle) {
  const url = `https://littleteddyshop.com/products/${encodeURIComponent(handle)}.json`;
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "BearHugKE-Catalog/1.0" },
    });
    if (!res.ok) return { imageUrl: null, imageUrls: [] };
    const json = await res.json();
    const imageUrls = (json.product?.images ?? [])
      .map((im) => im.src?.trim())
      .filter(Boolean);
    return { imageUrl: imageUrls[0] ?? null, imageUrls };
  } catch {
    return { imageUrl: null, imageUrls: [] };
  }
}

if (!existsSync(CATALOG)) {
  console.error("Missing data/littleteddy-catalog.json");
  process.exit(1);
}

const payload = JSON.parse(readFileSync(CATALOG, "utf8"));
const products = payload.products ?? [];
let ok = 0;
let miss = 0;

console.log(`Enriching images for ${products.length} products…`);

for (let i = 0; i < products.length; i++) {
  const item = products[i];
  const { imageUrl, imageUrls } = await fetchProductImages(item.sourceHandle);
  if (imageUrl) {
    item.imageUrl = imageUrl;
    item.imageUrls = imageUrls;
    ok += 1;
  } else {
    miss += 1;
  }
  if ((i + 1) % 25 === 0 || i === products.length - 1) {
    console.log(`  ${i + 1}/${products.length} — ${ok} with images, ${miss} missing`);
  }
  await sleep(DELAY_MS);
}

payload.imagesEnrichedAt = new Date().toISOString();
payload.imagesWithUrl = ok;
payload.imagesMissing = miss;
writeFileSync(CATALOG, JSON.stringify(payload, null, 2), "utf8");
console.log(`\nDone. ${ok} products have Shopify images (${miss} use CDN fallback on import).`);
