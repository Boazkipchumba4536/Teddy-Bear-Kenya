import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function parseEnvFile(path) {
  const env = {};
  if (!existsSync(path)) return env;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = { ...parseEnvFile(resolve(root, ".env")), ...parseEnvFile(resolve(root, ".env.local")) };
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const withBrand = await sb.from("products").select("id, brand, in_stock").limit(1);
const basic = await sb.from("products").select("id, slug, name, image, price").limit(5);
const { count } = await sb.from("products").select("*", { count: "exact", head: true });

console.log("product count:", count);
console.log("brand columns:", withBrand.error?.message || "ok");
if (basic.data?.length) {
  console.log("sample prices:", basic.data.map((p) => p.price).join(", "));
  console.log("sample image:", basic.data[0].image?.slice(0, 80));
}

const { data: allPrices } = await sb.from("products").select("price");
if (allPrices?.length) {
  const prices = allPrices.map((p) => p.price);
  const under15k = prices.filter((p) => p <= 15000).length;
  console.log("under 15k filter:", under15k, "of", prices.length, "max price:", Math.max(...prices));
}
