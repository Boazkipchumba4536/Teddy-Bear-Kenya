"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SIZE_GROUPS } from "@/lib/sizeCategories";
import type { BearSize } from "@/types/product";

export default function SizeCategoryBar() {
  const searchParams = useSearchParams();
  const active = searchParams.get("size") as BearSize | null;

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/shop"
        className={`shop-chip ${!active ? "shop-chip-active" : ""}`}
      >
        All sizes
      </Link>
      {SIZE_GROUPS.map((group) => (
        <Link
          key={group.size}
          href={group.href}
          title={group.description}
          className={`shop-chip ${active === group.size ? "shop-chip-active" : ""}`}
        >
          {group.label}
          <span className="font-normal opacity-80 ml-1 hidden sm:inline">({group.size})</span>
        </Link>
      ))}
    </div>
  );
}
