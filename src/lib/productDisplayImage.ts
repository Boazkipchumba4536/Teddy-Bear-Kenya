import {
  IMAGE_FALLBACK,
  productImage,
  optimizedImageUrl,
  isRemoteImage,
  type DisplayImageSize,
} from "@/lib/images";

export type ProductImageVariant = "thumb" | "card" | "detail";

const LOCAL_EXT = [".webp", ".jpg", ".jpeg", ".png"] as const;

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function variantToSize(variant: ProductImageVariant): DisplayImageSize {
  if (variant === "thumb") return "thumb";
  if (variant === "card") return "card";
  return "detail";
}

/** Protocol-relative and whitespace fixes for Shopify/CDN URLs. */
export function normalizeImageUrl(url: string): string {
  const trimmed = url?.trim() || "";
  if (!trimmed) return IMAGE_FALLBACK;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  return trimmed;
}

function isPlaceholderImage(url: string): boolean {
  if (!url || url === IMAGE_FALLBACK || url.includes("fallback")) return true;
  if (/^\/images\/image\d+\./i.test(url)) return true;
  return false;
}

function isBearHugCdn(url: string): boolean {
  return url.includes("teddybearhaven.co.ke");
}

function isTamboCdn(url: string): boolean {
  return url.includes("tamboteddies.com.au");
}

function isSupabaseStorage(url: string): boolean {
  return url.includes("supabase.co") && url.includes("/storage/");
}

/** Paths under public/images/products/{slug}.{ext} */
export function localProductImagePaths(slug: string): string[] {
  const safe = slug.replace(/[^a-z0-9-]/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  if (!safe) return [];
  return LOCAL_EXT.map((ext) => `/images/products/${safe}${ext}`);
}

function resolveRawImage(product: { id: string; slug?: string; image: string }): string {
  const src = normalizeImageUrl(product.image);
  if (isRemoteImage(src) && !isPlaceholderImage(src)) return src;
  if (src.startsWith("/images/products/")) return src;
  if (src.startsWith("/images/") && !isPlaceholderImage(src)) return src;

  if (product.slug) {
    const local = localProductImagePaths(product.slug);
    if (local.length) return local[0];
  }

  if (isPlaceholderImage(src) || !src.startsWith("/")) {
    const match = src.match(/\/images\/image(\d+)\./i);
    const n = match ? match[1] : String((hashId(product.id) % 16) + 1);
    return productImage(n);
  }

  return src;
}

export function getProductDisplayImage(
  product: { id: string; slug?: string; image: string },
  variant: ProductImageVariant = "card"
): string {
  const raw = resolveRawImage(product);
  if (raw === IMAGE_FALLBACK) return IMAGE_FALLBACK;
  if (!isBearHugCdn(raw)) return raw;
  if (isTamboCdn(raw)) return raw;
  return optimizedImageUrl(raw, variantToSize(variant));
}

export function getProductFullImage(product: {
  id: string;
  slug?: string;
  image: string;
}): string {
  return resolveRawImage(product);
}

/** Ordered candidates for <img onError> — local files, then CDN, then fallback. */
export function getProductImageCandidates(
  product: { id: string; slug?: string; image: string },
  variant: ProductImageVariant = "card"
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const push = (url: string) => {
    const u = normalizeImageUrl(url);
    if (!u || u === IMAGE_FALLBACK || seen.has(u)) return;
    seen.add(u);
    out.push(u);
  };

  const db = normalizeImageUrl(product.image);
  if (isRemoteImage(db) && !isPlaceholderImage(db)) {
    if (isSupabaseStorage(db) || isTamboCdn(db)) {
      push(db);
    } else if (isBearHugCdn(db)) {
      push(db);
      const sized = optimizedImageUrl(db, variantToSize(variant));
      if (sized !== db) push(sized);
    } else {
      push(db);
    }
  } else if (db.startsWith("/images/products/")) {
    push(db);
  } else if (db.startsWith("/images/") && !isPlaceholderImage(db)) {
    push(db);
  }

  if (product.slug) {
    for (const path of localProductImagePaths(product.slug)) {
      push(path);
    }
  }

  const resolved = resolveRawImage(product);
  push(resolved);

  if (isBearHugCdn(resolved) && !isTamboCdn(resolved)) {
    const sized = getProductDisplayImage(product, variant);
    if (sized !== resolved) push(sized);
  }

  push(IMAGE_FALLBACK);
  return out;
}

export function resolveStaticImage(src: string, variant: ProductImageVariant = "card"): string {
  return getProductDisplayImage({ id: "static", image: src }, variant);
}
