/**
 * Seeds Supabase with ~100 products, testimonials, settings, and an admin user.
 * Run: node scripts/seed-supabase.mjs
 * Requires .env or .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

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
  if (Object.keys(env).length === 0) {
    console.error("Missing .env or .env.local");
    process.exit(1);
  }
  return env;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = env.ADMIN_EMAIL || "admin@bearhugke.co.ke";
const adminPassword = env.ADMIN_PASSWORD || "BearHug@2026";

if (!url || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const JPG_ONLY = new Set([1]);
const img = (n) => (JPG_ONLY.has(n) ? `/images/image${n}.jpg` : `/images/image${n}.webp`);

const NAME_PREFIXES = [
  "Honey", "Blush", "Cloud", "Caramel", "Midnight", "Rose", "Velvet", "Sunset",
  "Luna", "Golden", "Pearl", "Cocoa", "Dream", "Snuggle", "Cuddle", "Warm",
];
const NAME_SUFFIXES = [
  "Love", "Dream", "Hug", "Joy", "Bliss", "Charm", "Delight", "Companion",
];
const SIZES = ["S", "M", "L", "Giant"];
const COLORS = ["Brown", "White", "Pink", "Grey", "Custom"];
const OCCASIONS = ["Valentine's", "Birthday", "Anniversary", "Baby Shower", "Get Well", "Just Because"];
const SIZE_PRICES = { S: 1800, M: 2500, L: 4000, Giant: 8500 };

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function generateProducts(count = 100) {
  const products = [];
  const seen = new Set();
  for (let i = 0; i < count; i++) {
    const size = SIZES[i % SIZES.length];
    const color = COLORS[i % COLORS.length];
    const name = `${NAME_PREFIXES[i % NAME_PREFIXES.length]} ${NAME_SUFFIXES[i % NAME_SUFFIXES.length]} ${size}`;
    let slug = slugify(`${name}-${i}`);
    while (seen.has(slug)) slug = `${slug}-${i}`;
    seen.add(slug);
    const imageNum = (i % 16) + 1;
    const primary = img(imageNum);
    const day = String((i % 28) + 1).padStart(2, "0");
    const month = String((i % 12) + 1).padStart(2, "0");
    products.push({
      slug,
      name,
      brand: "BearHug KE",
      in_stock: true,
      tagline: "Soft hugs for every occasion",
      description: `Premium ${color.toLowerCase()} ${size} teddy bear from BearHug KE.`,
      care_instructions: "Spot clean with mild detergent. Air dry.",
      delivery_info: "Same-day Nairobi before 12PM. Standard 2–3 days nationwide.",
      price: Math.max(1500, SIZE_PRICES[size] + (i % 5) * 200 - 200),
      size,
      color,
      occasions: [OCCASIONS[i % OCCASIONS.length], OCCASIONS[(i + 2) % OCCASIONS.length]],
      image: primary,
      images: [primary, img(((imageNum + 4) % 16) + 1)],
      badge: i % 11 === 0 ? "Best Seller" : i % 13 === 0 ? "New Arrival" : null,
      featured: i % 9 === 0,
      created_at: `2026-${month}-${day}`,
    });
  }
  return products;
}

async function ensureAdmin() {
  const { data: list } = await admin.auth.admin.listUsers();
  let user = list?.users?.find((u) => u.email === adminEmail);

  if (!user) {
    const { data, error } = await admin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { name: "BearHug Admin", role: "admin" },
    });
    if (error) throw new Error(`Create admin user: ${error.message}`);
    user = data.user;
    console.log(`Created admin user: ${adminEmail}`);
  } else {
    console.log(`Admin user exists: ${adminEmail}`);
  }

  const { error: profileErr } = await admin.from("profiles").upsert({
    id: user.id,
    name: "BearHug Admin",
    phone: "254712667782",
    role: "admin",
  });
  if (profileErr) console.warn("Profile upsert:", profileErr.message);
  else console.log("Admin profile role set to admin");
}

async function seedProducts() {
  const { count } = await admin.from("products").select("*", { count: "exact", head: true });
  if ((count ?? 0) >= 50) {
    console.log(`Products table already has ${count} rows — skipping product seed.`);
    return;
  }

  if ((count ?? 0) > 0) {
    await admin.from("products").delete().neq("slug", "");
  }

  const rows = generateProducts(100);
  const batchSize = 25;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await admin.from("products").insert(batch);
    if (error) throw new Error(`Insert products: ${error.message}`);
    console.log(`Inserted products ${i + 1}–${i + batch.length}`);
  }
}

async function seedTestimonials() {
  const { count } = await admin.from("testimonials").select("*", { count: "exact", head: true });
  if ((count ?? 0) > 0) {
    console.log("Testimonials already seeded.");
    return;
  }
  const { error } = await admin.from("testimonials").insert([
    { name: "Wanjiru", city: "Nairobi", rating: 5, quote: "Same-day delivery was perfect!", occasion: "Valentine's" },
    { name: "James", city: "Mombasa", rating: 5, quote: "Beautiful bears and easy M-Pesa.", occasion: "Birthday" },
    { name: "Amina", city: "Kisumu", rating: 5, quote: "Gift wrap was gorgeous.", occasion: "Anniversary" },
  ]);
  if (error) throw new Error(`Testimonials: ${error.message}`);
  console.log("Seeded testimonials");
}

async function main() {
  console.log("Connecting to Supabase…");
  await ensureAdmin();
  await seedProducts();
  await seedTestimonials();
  console.log("\nDone. Admin login:", adminEmail);
  console.log("Run migrations in Supabase SQL Editor if tables are missing (supabase/migrations/).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
