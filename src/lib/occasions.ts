import type { BearColor, BearSize, Occasion, Product } from "@/types/product";

export type OccasionCategory = {
  occasion: Occasion | "All";
  title: string;
  subtitle: string;
  image: string;
  href: string;
};

export const OCCASION_CATEGORIES: OccasionCategory[] = [
  {
    occasion: "All",
    title: "All Bears",
    subtitle: "Full collection",
    image: "/images/image3.webp",
    href: "/shop",
  },
  {
    occasion: "Valentine's",
    title: "Valentine's",
    subtitle: "Red & pink teddy bears",
    image: "/images/image6.webp",
    href: "/shop?occasion=Valentine's",
  },
  {
    occasion: "Birthday",
    title: "Birthday",
    subtitle: "Birthday teddy bears",
    image: "/images/image2.webp",
    href: "/shop?occasion=Birthday",
  },
  {
    occasion: "Anniversary",
    title: "Anniversary",
    subtitle: "Anniversary teddy bears",
    image: "/images/image16.webp",
    href: "/shop?occasion=Anniversary",
  },
  {
    occasion: "Baby Shower",
    title: "Baby Shower",
    subtitle: "Pastel baby shower bears",
    image: "/images/image13.webp",
    href: "/shop?occasion=Baby Shower",
  },
  {
    occasion: "Get Well",
    title: "Get Well",
    subtitle: "Comfort & get-well bears",
    image: "/images/image8.webp",
    href: "/shop?occasion=Get Well",
  },
  {
    occasion: "Just Because",
    title: "Just Because",
    subtitle: "Everyday teddy bears",
    image: "/images/image15.webp",
    href: "/shop?occasion=Just Because",
  },
];

export function getOccasionCategory(occasion: string): OccasionCategory | undefined {
  return OCCASION_CATEGORIES.find((c) => c.occasion === occasion);
}

function matchesKeywords(product: Product, keywords: string[]): boolean {
  const hay = `${product.name} ${product.tagline} ${product.slug}`.toLowerCase();
  return keywords.some((k) => hay.includes(k));
}

function isValentineBear(p: Product): boolean {
  if (!p.occasions.includes("Valentine's")) return false;
  if (p.color === "Pink") return true;
  return matchesKeywords(p, ["red", "rose", "valentine", "blush", "heart", "love"]);
}

function isBirthdayBear(p: Product): boolean {
  return p.occasions.includes("Birthday");
}

function isAnniversaryBear(p: Product): boolean {
  return p.occasions.includes("Anniversary");
}

function isBabyShowerBear(p: Product): boolean {
  return p.occasions.includes("Baby Shower");
}

function isGetWellBear(p: Product): boolean {
  return p.occasions.includes("Get Well");
}

function isJustBecauseBear(p: Product): boolean {
  return p.occasions.includes("Just Because");
}

/** Occasion-aware filtering — each category shows only matching teddy bears. */
export function filterByOccasionCategory(products: Product[], occasion: string): Product[] {
  if (!occasion || occasion === "All") return products;

  const matchers: Record<string, (p: Product) => boolean> = {
    "Valentine's": isValentineBear,
    Birthday: isBirthdayBear,
    Anniversary: isAnniversaryBear,
    "Baby Shower": isBabyShowerBear,
    "Get Well": isGetWellBear,
    "Just Because": isJustBecauseBear,
  };

  const match = matchers[occasion];
  if (!match) {
    return products.filter((p) => p.occasions.includes(occasion as Occasion));
  }

  return products.filter(match);
}

export function getVariantOptions(
  allProducts: Product[],
  product: Product
): { sizes: BearSize[]; colors: BearColor[] } {
  const related = allProducts.filter(
    (p) =>
      p.id === product.id ||
      p.occasions.some((o) => product.occasions.includes(o)) ||
      p.name.split(" ")[0] === product.name.split(" ")[0]
  );

  const sizes = Array.from(new Set(related.map((p) => p.size))) as BearSize[];
  const colors = Array.from(new Set(related.map((p) => p.color)));
  if (!colors.includes(product.color)) colors.unshift(product.color);

  return {
    sizes: sizes.length ? sizes : [product.size],
    colors: colors.length ? colors : [product.color],
  };
}
