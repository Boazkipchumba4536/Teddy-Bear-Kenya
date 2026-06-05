import { unstable_cache } from "next/cache";
import { fetchCatalogBundle } from "@/lib/actions/catalog";
import { slimCatalogBundle } from "@/lib/catalogCache";
import type { CatalogBundle } from "@/types/catalog";

export const CATALOG_CACHE_TAG = "catalog";

export const getCachedStorefrontCatalog = unstable_cache(
  async (): Promise<CatalogBundle> => slimCatalogBundle(await fetchCatalogBundle()),
  ["storefront-catalog-bundle"],
  { revalidate: 300, tags: [CATALOG_CACHE_TAG] }
);
