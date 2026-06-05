"use client";

import { memo, useMemo, useState } from "react";
import { IMAGE_FALLBACK } from "@/lib/images";
import {
  getProductImageCandidates,
  type ProductImageVariant,
} from "@/lib/productDisplayImage";

interface OptimizedProductImageProps {
  productId: string;
  slug?: string;
  src: string;
  alt: string;
  variant?: ProductImageVariant;
  priority?: boolean;
  className?: string;
}

function OptimizedProductImageInner({
  productId,
  slug,
  src,
  alt,
  variant = "card",
  priority = false,
  className = "object-cover",
}: OptimizedProductImageProps) {
  const candidates = useMemo(
    () => getProductImageCandidates({ id: productId, slug, image: src }, variant),
    [productId, slug, src, variant]
  );
  const [index, setIndex] = useState(0);
  const imgSrc = candidates[Math.min(index, candidates.length - 1)] ?? IMAGE_FALLBACK;
  const isFallback = imgSrc === IMAGE_FALLBACK || imgSrc.endsWith("fallback.svg");

  return (
    <img
      src={imgSrc}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      draggable={false}
      className={`absolute inset-0 h-full w-full ${className} ${
        isFallback ? "p-6 object-contain opacity-70" : ""
      }`}
      onError={() => {
        if (index + 1 < candidates.length) setIndex((i) => i + 1);
      }}
    />
  );
}

const OptimizedProductImage = memo(
  OptimizedProductImageInner,
  (prev, next) =>
    prev.productId === next.productId &&
    prev.slug === next.slug &&
    prev.src === next.src &&
    prev.variant === next.variant &&
    prev.priority === next.priority
);

export default OptimizedProductImage;
