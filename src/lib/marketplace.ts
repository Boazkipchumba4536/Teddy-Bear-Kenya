import type { Product } from "@/types/product";

/** Stable display metadata for marketplace-style product cards (express badge, etc.). */
export interface ProductMarketMeta {
  express: boolean;
  officialStore: boolean;
}

function hashId(id: string): number {
  return id.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0);
}

export function getProductMarketMeta(product: Product): ProductMarketMeta {
  const h = hashId(product.id);
  return {
    express: h % 5 === 0,
    officialStore: h % 11 === 0,
  };
}

export const MARKETPLACE_SORT_OPTIONS = [
  { value: "featured", label: "Popularity" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
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
