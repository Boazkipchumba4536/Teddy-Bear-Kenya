"use client";

import Image from "next/image";
import { useState } from "react";

/** Preview product images in admin (Supabase URLs + local paths). */
export default function ProductImagePreview({ src, alt }: { src: string; alt: string }) {
  const [useNative, setUseNative] = useState(false);

  if (!src) return null;

  if (useNative || src.startsWith("/")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      unoptimized
      onError={() => setUseNative(true)}
    />
  );
}
