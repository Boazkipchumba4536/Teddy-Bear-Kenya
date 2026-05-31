"use client";

import { useEffect, useMemo, useState } from "react";
import {
  IMAGE_FALLBACK,
  IMAGE_SIZES,
  imageSrcCandidates,
  variantFromSizes,
} from "@/lib/images";

interface ProductImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  fit?: "cover" | "contain";
}

export default function ProductImage({
  src,
  alt,
  priority = false,
  sizes = IMAGE_SIZES.card,
  className = "",
  fit = "cover",
}: ProductImageProps) {
  const variant = variantFromSizes(sizes);
  const candidates = useMemo(
    () => imageSrcCandidates(src, variant),
    [src, variant]
  );
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const currentSrc =
    index < candidates.length ? candidates[index] : IMAGE_FALLBACK;

  useEffect(() => {
    setIndex(0);
    setLoaded(false);
  }, [src, variant]);

  const fitClass = fit === "contain" ? "object-contain" : "object-cover";

  return (
    <div className="relative w-full h-full min-h-[1px] overflow-hidden bg-blush-dark">
      {!loaded && (
        <div
          className="absolute inset-0 z-10 animate-shimmer bg-gradient-to-r from-blush-dark via-white to-blush-dark bg-[length:200%_100%]"
          aria-hidden
        />
      )}
      <img
        src={currentSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        referrerPolicy="no-referrer"
        draggable={false}
        className={`absolute inset-0 w-full h-full max-w-none ${fitClass} transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (index + 1 < candidates.length) {
            setIndex((i) => i + 1);
            setLoaded(false);
          } else if (currentSrc !== IMAGE_FALLBACK) {
            setIndex(candidates.length);
            setLoaded(false);
          } else {
            setLoaded(true);
          }
        }}
      />
    </div>
  );
}
