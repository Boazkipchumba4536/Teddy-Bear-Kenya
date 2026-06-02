import type { Product } from "@/types/product";

/** Stable display metadata for marketplace-style product cards (pricing promos, ratings). */
export interface ProductMarketMeta {
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  express: boolean;
  officialStore: boolean;
  showRating: boolean;
}

function hashId(id: string): number {
  return id.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0);
}

export function getProductMarketMeta(product: Product): ProductMarketMeta {
  const h = hashId(product.id);
  const discountPercent = 20 + (h % 38);
  const originalPrice = Math.round(product.price / (1 - discountPercent / 100));
  const rating = Math.round((3.5 + (h % 15) / 10) * 10) / 10;
  const reviewCount = 1 + (h % 35);

  return {
    originalPrice,
    discountPercent,
    rating,
    reviewCount,
    express: h % 5 === 0,
    officialStore: h % 11 === 0,
    showRating: h % 7 !== 0,
  };
}

export function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - (half ? 1 : 0));
}

export const MARKETPLACE_SORT_OPTIONS = [
  { value: "featured", label: "Popularity" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Product Rating" },
] as const;

export const SHOP_CATEGORY_TABS = [
  { label: "All Teddy Bears", href: "/shop", occasion: "All" },
  { label: "Valentine's", href: "/shop?occasion=Valentine's", occasion: "Valentine's" },
  { label: "Birthday", href: "/shop?occasion=Birthday", occasion: "Birthday" },
  { label: "Anniversary", href: "/shop?occasion=Anniversary", occasion: "Anniversary" },
  { label: "Baby Shower", href: "/shop?occasion=Baby Shower", occasion: "Baby Shower" },
  { label: "Giant Bears", href: "/shop?size=Giant", occasion: null },
  { label: "Custom Bears", href: "/custom", occasion: null },
] as const;
