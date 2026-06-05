/**
 * Images from teddybearhaven.co.ke CDN.
 * WordPress only serves registered sizes (150, 300, 768, 1024) — not arbitrary dimensions.
 */

const CDN = "https://teddybearhaven.co.ke/wp-content/uploads";

export const IMAGE_FALLBACK = "/images/fallback.svg";

/** Full-bleed hero — giant pink & white collection shot (legacy CDN) */
export const HERO_IMAGE = `${CDN}/2025/01/Buy-Big-Teddy-Bear-Dolls-online-130cm-Giant-Teddy-Bear-in-Pink-and-White-front.jpg`;

/** Homepage hero carousel (local) */
export const HERO_CAROUSEL_IMAGES = [
  "/images/category-giant.webp",
  "/images/category-personalised.webp",
  "/images/image8.webp",
] as const;

export const ABOUT_IMAGE = "/images/image8.webp";

/** “Build a bear” section carousel (local) */
export const CUSTOM_BEAR_CAROUSEL_IMAGES = [
  "/images/image3.webp",
  "/images/image14.webp",
  "/images/image16.webp",
] as const;
export const LOGO_IMAGE = `${CDN}/2025/10/cropped-cropped-cropped-teddybearhaven_logo2-e1759596208230.jpeg`;

export const PRODUCT_COUNT = 16;

export const PRODUCT_IMAGES: Record<string, string> = {
  "1": `${CDN}/2025/01/Customized-teddy-bear-Gifts-for-her.jpg`,
  "2": `${CDN}/2026/02/Everyday-Joy-Teddy-Bear-cream-white.jpeg`,
  "3": `${CDN}/2026/02/medium-70cm-brown-teddy-bear.jpeg`,
  "4": `${CDN}/2026/02/big-teddy-bear-brown-hug-me.jpeg`,
  "5": `${CDN}/2026/02/giant-purple-teddy-bear.jpeg`,
  "6": `${CDN}/2026/02/Everyday-Joy-Teddy-Bear-pink.jpeg`,
  "7": `${CDN}/2024/01/cute-panda-teddy-140cm.webp`,
  "8": `${CDN}/2024/12/65cm-big-blue-sitting-teddy-bear.webp`,
  "9": `${CDN}/2025/01/Buy-Big-Teddy-Bear-Dolls-online-130cm-Giant-Teddy-Bear-in-Pink-and-White-front.jpg`,
  "10": `${CDN}/2025/01/Big-Blue-Love-Song-Teddy-Bear-Buy-Teddy-Bear-Dolls-Online.webp`,
  "11": `${CDN}/2026/01/big-teddy-bear-brown-cream.jpeg`,
  "12": `${CDN}/2025/01/Big-teddy-bear-white-Big-Teddy-Bear-in-Kenya.webp`,
  "13": `${CDN}/2024/12/big-white-65cm-teddy-bears.webp`,
  "14": `${CDN}/2026/02/med-large-purple-teddy-bear.jpeg`,
  "15": `${CDN}/2024/12/lady-holding-65cm-big-blue-teddy-bears.webp`,
  "16": `${CDN}/2025/01/Big-teddy-bear-collection-Big-Teddy-Bear-in-Kenya.webp`,
};

export const CATEGORY_IMAGES = {
  giant: `${CDN}/2024/04/WhatsApp-Image-2024-04-21-at-15.43.29_7852c64f.jpg`,
  big: `${CDN}/2026/02/big-teddy-bear-brown-hug-me.jpeg`,
  personalised: `${CDN}/2025/01/Customized-teddy-bear-Gifts-for-her.jpg`,
  panda: `${CDN}/2024/01/cute-panda-teddy-140cm.webp`,
} as const;

export const TESTIMONIAL_IMAGES = [1, 2, 3, 4, 5, 6, 7].map(
  (n) => `${CDN}/2024/02/testimonial${n}.jpg`
);

export type ImageVariant = "thumb" | "card" | "banner" | "detail" | "hero";
export type DisplayImageSize = "thumb" | "card" | "detail" | "full";

/** WordPress-registered widths that exist on the CDN. */
const WP_WIDTHS: Record<DisplayImageSize, number | null> = {
  thumb: 150,
  card: 300,
  detail: 768,
  full: null,
};

export const IMAGE_SIZES = {
  card: "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  hero: "(max-width: 1024px) 100vw, 560px",
  banner: "(max-width: 1024px) 100vw, 640px",
  detail: "(max-width: 1024px) 100vw, 600px",
  thumb: "80px",
  category: "(max-width: 640px) 50vw, 25vw",
  testimonial: "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px",
  logo: "48px",
} as const;

export function isRemoteImage(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://");
}

/** Build a WordPress sized URL (only uses sizes that exist: 150, 300, 768, 1024). */
export function optimizedImageUrl(url: string, size: DisplayImageSize): string {
  const trimmed = url?.trim();
  if (!trimmed || trimmed === IMAGE_FALLBACK || trimmed.includes("fallback")) {
    return IMAGE_FALLBACK;
  }
  if (!isRemoteImage(trimmed)) return trimmed;

  const px = WP_WIDTHS[size];
  if (px === null) return trimmed;
  if (/-\d+x\d+\.[a-z]+$/i.test(trimmed)) return trimmed;
  // This CDN has sized JPG/JPEG only; sized .webp paths 404.
  if (/\.webp$/i.test(trimmed)) return trimmed;

  return trimmed.replace(/(\.[a-z]+)$/i, `-${px}x${px}$1`);
}

/** @deprecated Use optimizedImageUrl — maps arbitrary px to nearest WP size. */
export function wpThumbnail(url: string, px: number): string {
  const allowed: DisplayImageSize[] =
    px <= 175 ? ["thumb"] : px <= 534 ? ["card"] : px <= 896 ? ["detail"] : ["full"];
  return optimizedImageUrl(url, allowed[0]);
}

const WP_SIZES: Record<ImageVariant, DisplayImageSize> = {
  thumb: "thumb",
  card: "card",
  banner: "detail",
  detail: "detail",
  hero: "full",
};

export function imageForProduct(productId: string | number): string {
  return PRODUCT_IMAGES[String(productId)] ?? IMAGE_FALLBACK;
}

export function imageSrcCandidates(
  basePath: string,
  variant: ImageVariant = "card"
): string[] {
  if (isRemoteImage(basePath)) {
    const size = WP_SIZES[variant];
    const sized = optimizedImageUrl(basePath, size);
    if (size === "full") return [basePath];
    return [sized, basePath];
  }

  const withoutExt = basePath.replace(/\.(jpe?g|png|webp|svg)$/i, "");
  return [".webp", ".jpg", ".jpeg", ".png"].map((ext) => `${withoutExt}${ext}`);
}

export function productImage(id: string): string {
  return imageForProduct(id);
}

export function variantFromSizes(sizes?: string): ImageVariant {
  if (!sizes) return "card";
  if (sizes.includes("80px") || sizes.includes("48px")) return "thumb";
  if (sizes.includes("560px") || sizes === IMAGE_SIZES.hero) return "hero";
  if (sizes === IMAGE_SIZES.detail) return "detail";
  if (sizes === IMAGE_SIZES.banner) return "banner";
  if (sizes === IMAGE_SIZES.testimonial || sizes === IMAGE_SIZES.category)
    return "card";
  return "card";
}
