/**
 * Updates Supabase product rows that still use /images/imageN.* placeholders
 * to real teddybearhaven.co.ke CDN URLs (fixes broken images site-wide).
 *
 * Run: npm run catalog:fix-images
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

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
    const p = resolve(root, file);
    if (existsSync(p)) Object.assign(env, parseEnvFile(p));
  }
  return env;
}

function cdnImage(n) {
  return PRODUCT_IMAGES[n] ?? PRODUCT_IMAGES[1];
}

function needsFix(url) {
  return !url || url.startsWith("/images/");
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: rows, error } = await admin.from("products").select("id, slug, image, images");
if (error) {
  console.error(error.message);
  process.exit(1);
}

let updated = 0;
for (let i = 0; i < rows.length; i++) {
  const row = rows[i];
  const imageNum = (i % 16) + 1;
  const primary = cdnImage(imageNum);
  const secondary = cdnImage(((imageNum + 5) % 16) + 1);
  const fixPrimary = needsFix(row.image);
  const fixImages =
    !row.images?.length || row.images.some((u) => needsFix(u));

  if (!fixPrimary && !fixImages) continue;

  const { error: upErr } = await admin
    .from("products")
    .update({
      image: fixPrimary ? primary : row.image,
      images: fixImages ? [fixPrimary ? primary : row.image, secondary] : row.images,
    })
    .eq("id", row.id);

  if (upErr) {
    console.error(row.slug, upErr.message);
  } else {
    updated += 1;
  }
}

console.log(`Updated ${updated} / ${rows.length} products with CDN image URLs.`);
