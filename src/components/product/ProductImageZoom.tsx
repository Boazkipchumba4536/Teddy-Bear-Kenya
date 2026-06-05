"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ProductImageZoomProps {
  src: string;
  alt: string;
  priority?: boolean;
  thumbnails?: string[];
}

export default function ProductImageZoom({
  src,
  alt,
  priority,
  thumbnails = [],
}: ProductImageZoomProps) {
  const [activeSrc, setActiveSrc] = useState(src);
  const [zooming, setZooming] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const images = thumbnails.length > 0 ? thumbnails : [src];

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) });
  };

  return (
    <div>
      <div
        ref={containerRef}
        className="image-frame cursor-zoom-in"
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onMouseMove={handleMove}
      >
        <Image
          src={activeSrc}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={85}
          className={`object-contain p-4 transition-transform duration-200 ease-out ${
            zooming ? "scale-[1.75]" : "scale-100"
          }`}
          style={
            zooming
              ? { transformOrigin: `${position.x}% ${position.y}%` }
              : undefined
          }
        />
        {zooming && (
          <span className="absolute bottom-3 right-3 text-[11px] bg-black/60 text-white px-2 py-1 rounded">
            Hover to zoom
          </span>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-3">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => setActiveSrc(img)}
              className={`image-thumb ${
                activeSrc === img ? "image-thumb-active" : "image-thumb-idle"
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
