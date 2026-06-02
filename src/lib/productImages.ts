const JPG_ONLY = new Set([1]);

export function catalogImage(n: number): string {
  return JPG_ONLY.has(n) ? `/images/image${n}.jpg` : `/images/image${n}.webp`;
}

const EXTRA_IMAGES = [
  "/images/category-giant.webp",
  "/images/category-personalised.webp",
  "/images/hero.webp",
] as const;

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
    while (poolIndex < pool.length + EXTRA_IMAGES.length) {
      const candidate =
        poolIndex < pool.length ? pool[poolIndex] : EXTRA_IMAGES[poolIndex - pool.length];
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
