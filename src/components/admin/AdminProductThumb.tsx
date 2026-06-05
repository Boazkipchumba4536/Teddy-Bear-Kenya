"use client";

import { memo } from "react";
import { getProductImageCandidates } from "@/lib/productDisplayImage";
import { IMAGE_FALLBACK } from "@/lib/images";

type AdminProductThumbProps = {
  productId: string;
  slug: string;
  image: string;
  name: string;
};

function AdminProductThumb({ productId, slug, image, name }: AdminProductThumbProps) {
  const candidates = getProductImageCandidates({ id: productId, slug, image }, "thumb");

  return (
    <img
      src={candidates[0] ?? IMAGE_FALLBACK}
      alt={name}
      width={48}
      height={48}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover"
      onError={(e) => {
        const img = e.currentTarget;
        const idx = candidates.indexOf(img.src);
        const next = candidates[idx + 1];
        if (next) img.src = next;
      }}
    />
  );
}

export default memo(AdminProductThumb);
