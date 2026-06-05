/**
 * Fetches products from Tambo Teddies (WooCommerce Store API).
 * Source shop: https://www.tamboteddies.com.au/australian-teddy-bears/
 *
 * Run: node scripts/fetch-tambo-catalog.mjs
 * Optional: node scripts/fetch-tambo-catalog.mjs --category=teddy-bears
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { stripHtml } from "./lib/catalog-shared.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../data/tambo-catalog.json");
const API = "https://www.tamboteddies.com.au/wp-json/wc/store/v1/products";
const SOURCE_PAGE = "https://www.tamboteddies.com.au/australian-teddy-bears/";
const BRAND = "Tambo Teddies";

const categoryFilter = process.argv
  .find((a) => a.startsWith("--category="))
  ?.split("=")[1];

function minorUnitsToAmount(cents, minorUnit = 2) {
  const n = Number(cents);
  if (!Number.isFinite(n)) return null;
  return n / 10 ** minorUnit;
}

function pickAudPrice(prices) {
  if (!prices) return null;
  const minor = prices.currency_minor_unit ?? 2;
  if (prices.price_range?.min_amount != null) {
    return minorUnitsToAmount(prices.price_range.min_amount, minor);
  }
  if (prices.price != null) {
    return minorUnitsToAmount(prices.price, minor);
  }
  return null;
}

async function fetchAllProducts() {
  const byId = new Map();

  for (let page = 1; page <= 20; page++) {
    const params = new URLSearchParams({ per_page: "100", page: String(page) });
    if (categoryFilter) params.set("category", categoryFilter);

    const res = await fetch(`${API}?${params}`, {
      headers: { "User-Agent": "BearHugCatalog/1.0 (+https://bearhugke.co.ke)" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} on page ${page}`);
    const batch = await res.json();
    if (!batch.length) break;
    for (const p of batch) byId.set(p.id, p);
    console.log(`Page ${page}: ${batch.length} rows (${byId.size} unique)`);
    if (batch.length < 100) break;
  }

  return [...byId.values()];
}

function normalize(item) {
  const name = item.name?.trim();
  const sourceSlug = item.slug?.trim();
  if (!name || !sourceSlug) return null;

  const priceAud = pickAudPrice(item.prices);
  if (priceAud == null || priceAud <= 0) return null;

  const tags = (item.tags ?? []).map((t) => t.name || t.slug).filter(Boolean);
  const categories = (item.categories ?? []).map((c) => c.slug).filter(Boolean);
  const imageUrls = (item.images ?? []).map((im) => im.src?.trim()).filter(Boolean);

  return {
    sourceSlug,
    name,
    brand: BRAND,
    priceAud,
    priceAudMax: item.prices?.price_range?.max_amount
      ? minorUnitsToAmount(item.prices.price_range.max_amount, item.prices.currency_minor_unit ?? 2)
      : null,
    currency: item.prices?.currency_code || "AUD",
    inStock: item.is_in_stock !== false && !item.stock_availability?.text?.toLowerCase()?.includes("out of stock"),
    productType: item.type || "",
    hasOptions: Boolean(item.has_options),
    categories,
    tags,
    description: stripHtml(item.description) || stripHtml(item.short_description) || null,
    imageUrl: imageUrls[0] || null,
    imageUrls,
    permalink: item.permalink || null,
  };
}

console.log(`Fetching Tambo Teddies…${categoryFilter ? ` (category=${categoryFilter})` : ""}`);
const raw = await fetchAllProducts();
const normalized = raw.map(normalize).filter(Boolean);
const skipped = raw.length - normalized.length;

const payload = {
  fetchedAt: new Date().toISOString(),
  sourceUrl: SOURCE_PAGE,
  apiBase: API,
  categoryFilter: categoryFilter || null,
  brand: BRAND,
  totalFetched: raw.length,
  totalIncluded: normalized.length,
  totalSkipped: skipped,
  products: normalized,
};

writeFileSync(OUT, JSON.stringify(payload, null, 2), "utf8");
console.log(`\nSaved ${normalized.length} products → data/tambo-catalog.json (${skipped} skipped)`);
console.log("Next: npm run catalog:import-tambo");
