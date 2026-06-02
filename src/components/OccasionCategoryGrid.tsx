"use client";

import Image from "next/image";
import Link from "next/link";
import { OCCASION_CATEGORIES } from "@/lib/occasions";

interface OccasionCategoryGridProps {
  selected?: string;
  onSelect?: (occasion: string) => void;
  /** Home: filter in place; shop: navigate via href */
  mode?: "filter" | "link";
}

export default function OccasionCategoryGrid({
  selected = "All",
  onSelect,
  mode = "link",
}: OccasionCategoryGridProps) {
  const items = OCCASION_CATEGORIES.filter((c) => c.occasion !== "All");

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
      {items.map((cat) => {
        const isActive = selected === cat.occasion;
        const inner = (
          <>
            <div className="relative aspect-[4/3] overflow-hidden bg-white">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 640px) 50vw, 16vw"
                quality={80}
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.src = "/images/fallback.svg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 text-white">
                <p className="text-sm font-bold leading-tight">{cat.title}</p>
                <p className="text-[10px] text-white/90">{cat.subtitle}</p>
              </div>
            </div>
            {isActive && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-market-orange ring-2 ring-white" />
            )}
          </>
        );

        const className = `group relative rounded-lg overflow-hidden border-2 transition-all shadow-market hover:shadow-market-hover ${
          isActive ? "border-market-orange" : "border-market-border hover:border-market-orange/60"
        }`;

        if (mode === "filter" && onSelect) {
          return (
            <button
              key={cat.occasion}
              type="button"
              onClick={() => onSelect(cat.occasion)}
              className={`${className} text-left`}
            >
              {inner}
            </button>
          );
        }

        return (
          <Link key={cat.occasion} href={cat.href} className={className}>
            {inner}
          </Link>
        );
      })}
    </div>
  );
}
