import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

export function parseEnvFile(path) {
  const env = {};
  if (!existsSync(path)) return env;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

export function loadEnv(root) {
  const env = {};
  for (const file of [".env", ".env.local"]) {
    const path = resolve(root, file);
    if (existsSync(path)) Object.assign(env, parseEnvFile(path));
  }
  return env;
}

export function stripHtml(html) {
  if (!html || typeof html !== "string") return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const OCCASIONS = [
  "Valentine's",
  "Birthday",
  "Anniversary",
  "Baby Shower",
  "Get Well",
  "Just Because",
];

export const SIZES = ["S", "M", "L", "Giant"];
export const COLORS = ["Brown", "White", "Pink", "Grey", "Custom"];

export function inferSize(name, description, productType) {
  const t = `${name} ${description} ${productType}`.toLowerCase();
  if (/\b(giant|life[- ]?size|180\s*cm|150\s*cm|120\s*cm)\b/.test(t)) return "Giant";
  if (/\b(100\s*cm|90\s*cm|80\s*cm|70\s*cm|large|xl)\b/.test(t)) return "L";
  if (/\b(small|mini|30\s*cm|35\s*cm|40\s*cm)\b/.test(t)) return "S";
  return "M";
}

export function inferColor(name, tags) {
  const t = `${name} ${(tags || []).join(" ")}`.toLowerCase();
  if (/\b(blue|navy|azure|cyan|teal)\b/.test(t)) return "Blue";
  if (/\b(red|crimson|scarlet|ruby|burgundy|maroon)\b/.test(t)) return "Red";
  if (/\b(purple|violet|lavender|mauve|mulberry)\b/.test(t)) return "Purple";
  if (/\b(green|mint|sage|olive)\b/.test(t)) return "Green";
  if (/\b(yellow|gold|lemon|mustard)\b/.test(t)) return "Yellow";
  if (/\b(black|charcoal|ebony)\b/.test(t)) return "Black";
  if (/\b(multicolor|multi colour|rainbow|spotty)\b/.test(t)) return "Multicolor";
  if (/\b(pink|rose|blush|magenta)\b/.test(t)) return "Pink";
  if (/\b(white|ivory|snow)\b/.test(t)) return "White";
  if (/\b(cream|camel|beige)\b/.test(t)) return "Cream";
  if (/\b(grey|gray|silver)\b/.test(t)) return "Grey";
  if (/\b(brown|chocolate|caramel|mocha|tan|honey)\b/.test(t)) return "Brown";
  return "Brown";
}

export function inferOccasions(name, tags, productType) {
  const t = `${name} ${(tags || []).join(" ")} ${productType}`.toLowerCase();
  const out = [];
  if (/\b(valentine|love|heart|romantic)\b/.test(t)) out.push("Valentine's");
  if (/\b(birthday|bday|milestone)\b/.test(t)) out.push("Birthday");
  if (/\b(anniversary|wedding)\b/.test(t)) out.push("Anniversary");
  if (/\b(baby shower|new baby|christening|baby gift)\b/.test(t)) out.push("Baby Shower");
  if (/\b(get well|comfort|sympathy)\b/.test(t)) out.push("Get Well");
  if (!out.length) out.push("Just Because");
  return [...new Set(out)].slice(0, 2);
}
