import { productImage, optimizedImageUrl } from "@/lib/images";

/** CDN card-sized image (300×300) — always exists on WordPress. */
export function catalogImage(n: number): string {
  return optimizedImageUrl(productImage(String(n)), "card");
}

/** Assign a unique primary image per product (no duplicate hero images in grids). */
export function assignUniquePrimaryImages<T extends { slug: string; image: string }>(
  items: T[]
): T[] {
  const used = new Set<string>();
  const pool = Array.from({ length: 16 }, (_, i) => catalogImage(i + 1));
  let poolIndex = 0;

  return items.map((item) => {
    if (!used.has(item.image)) {
      used.add(item.image);
      return item;
    }

    let next: string | undefined;
    while (poolIndex < pool.length) {
      const candidate = pool[poolIndex];
      poolIndex += 1;
      if (!used.has(candidate)) {
        next = candidate;
        break;
      }
    }

    const image = next ?? item.image;
    used.add(image);
    return { ...item, image };
  });
}
