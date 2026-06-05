import type { BearColor, BearSize, Product } from "@/types/product";
import { filterByOccasionCategory } from "@/lib/occasions";

export function filterProducts(
  productList: Product[],
  filters: {
    occasion?: string;
    brand?: string;
    sizes?: BearSize[];
    colors?: BearColor[];
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    inStockOnly?: boolean;
  }
): Product[] {
  let result = productList;

  if (filters.brand) {
    const b = filters.brand.toLowerCase();
    result = result.filter(
      (p) =>
        p.brand.toLowerCase() === b ||
        p.tagline.toLowerCase().startsWith(`${b} collection`)
    );
  }
  if (filters.inStockOnly) {
    result = result.filter((p) => p.inStock);
  }
  if (filters.occasion && filters.occasion !== "All") {
    result = filterByOccasionCategory(result, filters.occasion);
  }
  if (filters.sizes?.length) {
    result = result.filter((p) => filters.sizes!.includes(p.size));
  }
  if (filters.colors?.length) {
    result = result.filter((p) => filters.colors!.includes(p.color));
  }
  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }

  const sorted = [...result];
  switch (filters.sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    default:
      sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  return sorted;
}

export function getRelatedProducts(productList: Product[], slug: string, limit = 4): Product[] {
  const current = productList.find((p) => p.slug === slug);
  if (!current) return productList.slice(0, limit);
  return productList
    .filter((p) => p.slug !== slug && p.occasions.some((o) => current.occasions.includes(o)))
    .slice(0, limit);
}
