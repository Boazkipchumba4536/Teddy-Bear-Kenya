"use server";

import { createClient } from "@/lib/supabase/server";
import {
  mapProduct,
  mapProductList,
  mapSiteSettings,
  mapTestimonial,
  type DbProductListRow,
} from "@/lib/supabase/mappers";
import type { CatalogBundle } from "@/types/catalog";
import type { SiteSettings, Testimonial } from "@/types/admin";
import type { Product } from "@/types/product";
import { DEFAULT_PRODUCTS, DEFAULT_TESTIMONIALS } from "@/lib/products";
import { defaultSiteSettings } from "@/store/catalogStore";

export type { CatalogBundle };

const PRODUCT_LIST_COLUMNS =
  "id, slug, name, brand, in_stock, tagline, price, size, color, occasions, image, badge, featured, created_at";

/** When migration 005 is not applied yet. */
const PRODUCT_LIST_COLUMNS_LEGACY =
  "id, slug, name, tagline, price, size, color, occasions, image, badge, featured, created_at";

function isMissingColumnError(message: string | undefined): boolean {
  if (!message) return false;
  return (
    message.includes("does not exist") ||
    message.includes("brand") ||
    message.includes("in_stock")
  );
}

async function fetchProductRows(supabase: Awaited<ReturnType<typeof createClient>>) {
  const listQuery = (columns: string) =>
    supabase
      .from("products")
      .select(columns)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(5000);

  // Prefer legacy columns first — avoids a failed round-trip when migration 005 is missing.
  let res = await listQuery(PRODUCT_LIST_COLUMNS_LEGACY);
  if (res.error && isMissingColumnError(res.error.message)) {
    res = await listQuery(PRODUCT_LIST_COLUMNS);
  } else if (!res.error && !res.data?.length) {
    const retry = await listQuery(PRODUCT_LIST_COLUMNS);
    if (!retry.error && retry.data?.length) res = retry;
  }
  return res;
}

export async function fetchCatalogBundle(): Promise<CatalogBundle> {
  let productsFromDatabase = false;
  let testimonialsFromDatabase = false;
  let products = DEFAULT_PRODUCTS;
  let testimonials = DEFAULT_TESTIMONIALS;
  let settings = defaultSiteSettings;

  try {
    const supabase = await createClient();

    const [productsRes, testimonialsRes, settingsRes] = await Promise.all([
      fetchProductRows(supabase),
      supabase.from("testimonials").select("*").order("created_at"),
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    ]);

    if (!productsRes.error && productsRes.data?.length) {
      products = (productsRes.data as unknown as DbProductListRow[]).map(mapProductList);
      productsFromDatabase = true;
    }

    if (!testimonialsRes.error && testimonialsRes.data?.length) {
      testimonials = testimonialsRes.data.map(mapTestimonial);
      testimonialsFromDatabase = true;
    }

    if (!settingsRes.error && settingsRes.data) {
      settings = mapSiteSettings(settingsRes.data);
    }
  } catch {
    /* use defaults */
  }

  return {
    products,
    testimonials,
    settings,
    productsFromDatabase,
    testimonialsFromDatabase,
  };
}

/** Storefront: live DB products, or demo catalog when DB is empty/unavailable. */
export async function fetchProducts(): Promise<Product[]> {
  const bundle = await fetchCatalogBundle();
  return bundle.products;
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) return mapProduct(data);
  } catch {
    /* fallback */
  }
  return DEFAULT_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const bundle = await fetchCatalogBundle();
  return bundle.testimonials;
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const bundle = await fetchCatalogBundle();
  return bundle.settings;
}

/** Admin: only rows stored in Supabase (no demo fallback). */
export async function fetchProductsFromDatabase(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data?.length) return [];
    return data.map(mapProduct);
  } catch {
    return [];
  }
}

export async function getDatabaseProductCount(): Promise<number> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}
