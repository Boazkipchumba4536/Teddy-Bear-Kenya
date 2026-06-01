import type { BearColor, BearSize, Occasion, Product, ProductBadge } from "@/types/product";
import { DEFAULT_PRODUCTS } from "@/lib/products";
import { SIZE_PRICES } from "@/lib/products";

const JPG_ONLY = new Set([1]);
const img = (n: number) =>
  JPG_ONLY.has(n) ? `/images/image${n}.jpg` : `/images/image${n}.webp`;

const NAME_PREFIXES = [
  "Honey", "Blush", "Cloud", "Caramel", "Midnight", "Rose", "Velvet", "Sunset",
  "Luna", "Golden", "Pearl", "Cocoa", "Dream", "Snuggle", "Cuddle", "Warm",
  "Sweet", "Gentle", "Cosy", "Cherish",
];

const NAME_SUFFIXES = [
  "Love", "Dream", "Hug", "Joy", "Bliss", "Charm", "Delight", "Whisper",
  "Embrace", "Treasure", "Classic", "Deluxe", "Companion", "Keepsake", "Bear",
];

const TAGLINES = [
  "Soft hugs for every occasion",
  "Made for moments that matter",
  "Premium plush, Nairobi-loved",
  "A gift they'll never forget",
  "Cuddle-ready from day one",
];

const OCCASIONS: Occasion[] = [
  "Valentine's",
  "Birthday",
  "Anniversary",
  "Baby Shower",
  "Get Well",
  "Just Because",
];

const SIZES: BearSize[] = ["S", "M", "L", "Giant"];
const COLORS: BearColor[] = ["Brown", "White", "Pink", "Grey", "Custom"];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}

/** Generates ~100 unique catalog products for Supabase seeding. */
export function generateSeedCatalog(targetCount = 100): Omit<Product, "id">[] {
  const base = DEFAULT_PRODUCTS.map(({ id: _id, ...p }) => p);
  const seen = new Set(base.map((p) => p.slug));
  const products: Omit<Product, "id">[] = [...base];

  let i = 0;
  while (products.length < targetCount) {
    const prefix = pick(NAME_PREFIXES, i);
    const suffix = pick(NAME_SUFFIXES, i + 7);
    const size = pick(SIZES, i);
    const color = pick(COLORS, i + 3);
    const name = `${prefix} ${suffix} ${size}`;
    let slug = slugify(`${prefix}-${suffix}-${size}-${i}`);
    while (seen.has(slug)) {
      slug = `${slug}-${i}`;
    }
    seen.add(slug);

    const imageNum = (i % 16) + 1;
    const primary = img(imageNum);
    const gallery = [
      primary,
      img(((imageNum + 3) % 16) + 1),
      img(((imageNum + 7) % 16) + 1),
    ].filter((u, idx, arr) => arr.indexOf(u) === idx);

    const occasionCount = 1 + (i % 3);
    const occasions: Occasion[] = [];
    for (let o = 0; o < occasionCount; o++) {
      const occ = pick(OCCASIONS, i + o);
      if (!occasions.includes(occ)) occasions.push(occ);
    }

    const priceBase = SIZE_PRICES[size];
    const price = priceBase + (i % 5) * 200 - 400;
    const badge: ProductBadge | undefined =
      i % 11 === 0 ? "Best Seller" : i % 13 === 0 ? "New Arrival" : undefined;

    const day = String((i % 28) + 1).padStart(2, "0");
    const month = String((i % 12) + 1).padStart(2, "0");

    products.push({
      slug,
      name,
      tagline: pick(TAGLINES, i),
      description: `The ${name} is a ${color.toLowerCase()} ${size}-size teddy bear crafted for Kenyan gift-givers. Ultra-soft plush, gift-ready packaging, and nationwide delivery from BearHug KE.`,
      careInstructions:
        "Spot clean with mild detergent. Air dry away from direct sunlight. Fluff gently after drying.",
      deliveryInfo:
        "Same-day delivery in Nairobi for orders before 12PM. Standard delivery 2–3 business days nationwide.",
      price: Math.max(1500, price),
      size,
      color,
      occasions: occasions.length ? occasions : ["Just Because"],
      image: primary,
      images: gallery,
      badge,
      featured: i % 9 === 0,
      createdAt: `2026-${month}-${day}`,
    });
    i++;
  }

  return products.slice(0, targetCount);
}

export const SEED_CATALOG_PRODUCTS = generateSeedCatalog(100);
