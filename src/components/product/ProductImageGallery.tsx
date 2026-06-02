"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
  priority?: boolean;
}

export default function ProductImageGallery({
  images,
  alt,
  priority = false,
}: ProductImageGalleryProps) {
  const [selected, setSelected] = useState(0);
  const list = images.length ? images : ["/images/fallback.svg"];

  return (
    <div>
      <div className="relative aspect-square rounded-lg overflow-hidden bg-white border border-market-border group cursor-zoom-in">
        <Image
          src={list[selected]}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={85}
          className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-[1.35] origin-center"
        />
        <span className="absolute bottom-3 right-3 text-[11px] bg-black/50 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Hover to zoom
        </span>
      </div>
      {list.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-3">
          {list.slice(0, 4).map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`relative aspect-square rounded border-2 overflow-hidden bg-white transition-colors ${
                selected === i ? "border-market-orange" : "border-market-border hover:border-market-orange/50"
              }`}
            >
              <Image src={img} alt="" fill sizes="80px" quality={75} className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
