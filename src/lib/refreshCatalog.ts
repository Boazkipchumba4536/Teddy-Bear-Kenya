"use client";

import type { Product } from "@/types/product";
import { mapProduct } from "@/lib/supabase/mappers";
import type { DbProduct } from "@/lib/supabase/types";
import { useCatalogStore } from "@/store/catalogStore";

/** Patch one product in the client store after admin save (avoids refetching 700+ rows). */
export function patchProductInCatalog(product: Product) {
  const state = useCatalogStore.getState();
  const next = state.products.map((p) => (p.id === product.id ? product : p));
  state.hydrate({
    products: next,
    testimonials: state.testimonials,
    settings: state.settings,
    productsFromDatabase: true,
    testimonialsFromDatabase: state.testimonialsFromDatabase,
  });
}

export function appendProductToCatalog(row: DbProduct) {
  const product = mapProduct(row);
  const state = useCatalogStore.getState();
  state.hydrate({
    products: [...state.products, product],
    testimonials: state.testimonials,
    settings: state.settings,
    productsFromDatabase: true,
    testimonialsFromDatabase: state.testimonialsFromDatabase,
  });
}

export function removeProductFromCatalog(id: string) {
  const state = useCatalogStore.getState();
  state.hydrate({
    products: state.products.filter((p) => p.id !== id),
    testimonials: state.testimonials,
    settings: state.settings,
    productsFromDatabase: state.productsFromDatabase,
    testimonialsFromDatabase: state.testimonialsFromDatabase,
  });
}

/** Refresh testimonials/settings only (fast — used from admin settings/testimonials). */
export async function refreshCatalog() {
  const { fetchTestimonials, fetchSiteSettings } = await import("@/lib/actions/catalog");
  const [testimonials, settings] = await Promise.all([
    fetchTestimonials(),
    fetchSiteSettings(),
  ]);
  const state = useCatalogStore.getState();
  state.hydrate({
    products: state.products,
    testimonials,
    settings,
    productsFromDatabase: state.productsFromDatabase,
    testimonialsFromDatabase: true,
  });
}

/** After seeding catalog — refetch all product summaries. */
export async function refreshFullCatalog() {
  const { adminFetchProductSummaries } = await import("@/lib/actions/admin");
  const products = await adminFetchProductSummaries();
  const state = useCatalogStore.getState();
  state.hydrate({
    products,
    testimonials: state.testimonials,
    settings: state.settings,
    productsFromDatabase: true,
    testimonialsFromDatabase: state.testimonialsFromDatabase,
  });
}
