import type { CatalogBundle } from "@/types/catalog";
import type { Product } from "@/types/product";

const CACHE_KEY = "bearhug-catalog-v9";
const MAX_AGE_MS = 60 * 60 * 1000;

/** Minimal listing shape — keeps sessionStorage under quota for 662+ products. */
export function slimProductsForCache(products: Product[]): Product[] {
  return products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand ?? "",
    inStock: p.inStock ?? true,
    tagline: (p.tagline ?? "").slice(0, 120),
    description: "",
    careInstructions: "",
    deliveryInfo: "",
    price: p.price,
    size: p.size,
    color: p.color,
    occasions: p.occasions ?? [],
    image: p.image,
    images: p.image ? [p.image] : [],
    badge: p.badge,
    featured: p.featured ?? false,
    createdAt: p.createdAt,
  }));
}

export function slimCatalogBundle(bundle: CatalogBundle): CatalogBundle {
  return {
    ...bundle,
    products: slimProductsForCache(bundle.products),
  };
}

export function readCatalogCache(): CatalogBundle | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { savedAt, bundle } = JSON.parse(raw) as {
      savedAt: number;
      bundle: CatalogBundle;
    };
    if (Date.now() - savedAt > MAX_AGE_MS) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return bundle;
  } catch {
    return null;
  }
}

export function writeCatalogCache(bundle: CatalogBundle) {
  if (typeof window === "undefined") return;
  const save = () => {
    try {
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ savedAt: Date.now(), bundle: slimCatalogBundle(bundle) })
      );
    } catch {
      sessionStorage.removeItem(CACHE_KEY);
    }
  };
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(save);
  } else {
    setTimeout(save, 0);
  }
}
