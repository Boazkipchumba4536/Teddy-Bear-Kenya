"use client";

import { fetchProducts, fetchSiteSettings, fetchTestimonials } from "@/lib/actions/catalog";
import { useCatalogStore } from "@/store/catalogStore";

export async function refreshCatalog() {
  const [products, testimonials, settings] = await Promise.all([
    fetchProducts(),
    fetchTestimonials(),
    fetchSiteSettings(),
  ]);
  useCatalogStore.getState().hydrate({ products, testimonials, settings });
}
