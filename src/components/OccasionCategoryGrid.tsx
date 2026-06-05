"use client";

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
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <img
                src={cat.image}
                alt={cat.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent rounded-2xl" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-sm font-semibold leading-tight">{cat.title}</p>
                <p className="text-[10px] text-white/85 mt-0.5">{cat.subtitle}</p>
              </div>
            </div>
            {isActive && (
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-caramel ring-2 ring-white z-10" />
            )}
          </>
        );

        const className = `group relative rounded-2xl overflow-hidden transition-all duration-300 shadow-card hover:shadow-elevated hover:scale-[1.02] ring-2 ${
          isActive ? "ring-caramel" : "ring-transparent hover:ring-caramel/20"
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
