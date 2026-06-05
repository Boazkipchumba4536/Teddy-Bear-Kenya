"use client";

import { createContext, useContext } from "react";
import type { CatalogBundle } from "@/types/catalog";
import type { Product } from "@/types/product";
import type { SiteSettings, Testimonial } from "@/types/admin";
import { useCatalogStore } from "@/store/catalogStore";

export const CatalogSeedContext = createContext<CatalogBundle | null>(null);

export function useCatalogSeed(): CatalogBundle | null {
  return useContext(CatalogSeedContext);
}

/** Products from the live store, or the server-seeded bundle until hydration completes. */
export function useProductsWithSeed(): Product[] {
  const seed = useCatalogSeed();
  const products = useCatalogStore((s) => s.products);
  if (products.length > 0) return products;
  return seed?.products ?? [];
}

export function useCatalogLoadedWithSeed(): boolean {
  const seed = useCatalogSeed();
  const loaded = useCatalogStore((s) => s.loaded);
  return loaded || (seed?.products?.length ?? 0) > 0;
}

export function useTestimonialsWithSeed(): Testimonial[] {
  const seed = useCatalogSeed();
  const loaded = useCatalogStore((s) => s.loaded);
  const testimonials = useCatalogStore((s) => s.testimonials);
  if (loaded) return testimonials;
  return seed?.testimonials ?? testimonials;
}

export function useSiteSettingsWithSeed(): SiteSettings {
  const seed = useCatalogSeed();
  const loaded = useCatalogStore((s) => s.loaded);
  const settings = useCatalogStore((s) => s.settings);
  if (loaded) return settings;
  return seed?.settings ?? settings;
}
