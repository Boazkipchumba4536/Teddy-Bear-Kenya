"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ImageFadeCarouselProps = {
  images: readonly string[];
  alt: string;
  intervalMs?: number;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  showDots?: boolean;
};

export default function ImageFadeCarousel({
  images,
  alt,
  intervalMs = 5000,
  className = "relative w-full h-full",
  imageClassName = "object-cover object-center",
  sizes = "100vw",
  priority = false,
  showDots = true,
}: ImageFadeCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images.length, intervalMs]);

  if (images.length === 0) return null;

  return (
    <div className={className}>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={i === index ? alt : ""}
          fill
          sizes={sizes}
          priority={priority && i === 0}
          className={`${imageClassName} transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100 z-[1]" : "opacity-0 z-0"
          }`}
          aria-hidden={i !== index}
        />
      ))}
      {showDots && images.length > 1 && (
        <div
          className="absolute bottom-4 right-4 z-10 flex gap-1.5"
          role="tablist"
          aria-label="Carousel slides"
        >
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
