"use client";

import { useMemo, useState } from "react";
import {
  getProductImageCandidates,
} from "@/lib/productDisplayImage";
import { IMAGE_FALLBACK } from "@/lib/images";

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
  productId: string;
  slug?: string;
  priority?: boolean;
}

/** Storefront: single main product image only. */
export default function ProductImageGallery({
  images,
  alt,
  productId,
  slug,
  priority = false,
}: ProductImageGalleryProps) {
  const mainUrl = useMemo(() => {
    const primary = images.map((s) => s?.trim()).find(Boolean);
    return primary || IMAGE_FALLBACK;
  }, [images]);

  const mainCandidates = useMemo(
    () => getProductImageCandidates({ id: productId, slug, image: mainUrl }, "detail"),
    [mainUrl, productId, slug]
  );
  const [mainIndex, setMainIndex] = useState(0);
  const mainSrc = mainCandidates[Math.min(mainIndex, mainCandidates.length - 1)] ?? IMAGE_FALLBACK;

  return (
    <div>
      <div className="image-frame group cursor-zoom-in">
        <img
          src={mainSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-300 ease-out group-hover:scale-[1.08] origin-center"
          onError={() => {
            if (mainIndex + 1 < mainCandidates.length) setMainIndex((i) => i + 1);
          }}
        />
      </div>
    </div>
  );
}
