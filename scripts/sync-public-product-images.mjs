/**
 * Downloads product images from Supabase/CDN into public/images/products/{slug}.jpg
 * so the storefront can serve them locally (fast, reliable).
 *
 * Run: npm run catalog:sync-public-images
 * Then in Supabase you can set image to /images/products/{slug}.jpg (optional — shop auto-tries these paths).
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const OUT_DIR = resolve(root, "public/images/products");

function parseEnvFile(path) {
  const env = {};
  if (!existsSync(path)) return env;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

function loadEnv() {
  const env = {};
  for (const file of [".env", ".env.local"]) {
    Object.assign(env, parseEnvFile(resolve(root, file)));
  }
  return env;
}

function extFromUrl(url) {
  const m = url.match(/\.(jpe?g|png|webp|gif)(\?|$)/i);
  return m ? m[1].toLowerCase().replace("jpeg", "jpg") : "jpg";
}

async function download(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "BearHugKE-ImageSync/1.0" },
    signal: AbortSignal.timeout(25_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

const supabase = createClient(url, key);
const { data: rows, error } = await supabase
  .from("products")
  .select("slug, image")
  .order("slug")
  .limit(5000);

if (error) {
  console.error(error.message);
  process.exit(1);
}

let ok = 0;
let skip = 0;
let fail = 0;

for (const row of rows ?? []) {
  const slug = row.slug?.trim();
  const image = row.image?.trim();
  if (!slug || !image || image.startsWith("/images/image")) {
    skip++;
    continue;
  }
  if (image.startsWith("/images/products/")) {
    skip++;
    continue;
  }
  if (!image.startsWith("http")) {
    skip++;
    continue;
  }

  const ext = extFromUrl(image);
  const outPath = resolve(OUT_DIR, `${slug}.${ext}`);
  if (existsSync(outPath)) {
    skip++;
    continue;
  }

  try {
    const buf = await download(image);
    writeFileSync(outPath, buf);
    ok++;
    if (ok % 25 === 0) console.log(`  saved ${ok}…`);
  } catch (e) {
    fail++;
    console.warn(`  skip ${slug}: ${e.message}`);
  }
}

console.log(`\nDone. ${ok} downloaded, ${skip} skipped, ${fail} failed.`);
console.log(`Files in public/images/products — shop will try /images/products/{slug}.jpg|.webp|… automatically.`);
