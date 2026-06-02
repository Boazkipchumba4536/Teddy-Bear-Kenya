"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SIZE_GROUPS } from "@/lib/sizeCategories";
import type { BearSize } from "@/types/product";

export default function SizeCategoryBar() {
  const searchParams = useSearchParams();
  const active = searchParams.get("size") as BearSize | null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Link
        href="/shop"
        className={`px-3 py-1.5 text-[12px] font-semibold rounded-full border transition-colors ${
          !active
            ? "bg-market-orange text-white border-market-orange"
            : "bg-white text-market-text border-market-border hover:border-market-orange"
        }`}
      >
        All sizes
      </Link>
      {SIZE_GROUPS.map((group) => (
        <Link
          key={group.size}
          href={group.href}
          title={group.description}
          className={`px-3 py-1.5 text-[12px] font-semibold rounded-full border transition-colors ${
            active === group.size
              ? "bg-market-orange text-white border-market-orange"
              : "bg-white text-market-text border-market-border hover:border-market-orange"
          }`}
        >
          {group.label}
          <span className="font-normal opacity-80 ml-1 hidden sm:inline">({group.size})</span>
        </Link>
      ))}
    </div>
  );
}
