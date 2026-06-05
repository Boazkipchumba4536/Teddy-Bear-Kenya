import { useMemo } from "react";
import { useCatalogStore } from "@/store/catalogStore";
import { filterProducts as filterProductsLib } from "@/lib/filterProducts";
import type { BearColor, BearSize, Product } from "@/types/product";
import {
  useCatalogLoadedWithSeed,
  useProductsWithSeed,
  useSiteSettingsWithSeed,
  useTestimonialsWithSeed,
} from "@/providers/catalogContext";

export function useProducts() {
  return useProductsWithSeed();
}

export function useCatalogLoaded() {
  return useCatalogLoadedWithSeed();
}

export function useCatalogLoading() {
  const loaded = useCatalogLoadedWithSeed();
  const loading = useCatalogStore((s) => s.loading);
  return !loaded && loading;
}

export function useTestimonials() {
  return useTestimonialsWithSeed();
}

export function useSiteSettings() {
  return useSiteSettingsWithSeed();
}

export function useProductBySlug(slug: string): Product | undefined {
  const products = useProductsWithSeed();
  return products.find((p) => p.slug === slug);
}

export function useFilteredProducts(filters: {
  occasion?: string;
  sizes?: BearSize[];
  colors?: BearColor[];
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}) {
  const { occasion, sizes, colors, minPrice, maxPrice, sort } = filters;
  const products = useProducts();
  return useMemo(
    () =>
      filterProductsLib(products, {
        occasion,
        sizes,
        colors,
        minPrice,
        maxPrice,
        sort,
      }),
    [products, occasion, sizes, colors, minPrice, maxPrice, sort]
  );
}
