"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  BEAR_SIZES,
  BEAR_COLORS,
  OCCASIONS,
} from "@/lib/products";
import { getSizeLabel } from "@/lib/sizeCategories";
import type { BearColor, BearSize } from "@/types/product";

interface ShopSidebarProps {
  occasion: string;
  sizes: BearSize[];
  colors: BearColor[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  expressOnly: boolean;
  priceMin: number;
  priceMax: number;
  onOccasion: (v: string) => void;
  onToggleSize: (s: BearSize) => void;
  onToggleColor: (c: BearColor) => void;
  onMinPrice: (v: number) => void;
  onMaxPrice: (v: number) => void;
  onMinRating: (v: number) => void;
  onExpressOnly: (v: boolean) => void;
  onApplyPrice: () => void;
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-market-border py-4 first:pt-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-[11px] font-bold uppercase tracking-wider text-market-dark">
          {title}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-market-muted" />
        ) : (
          <ChevronDown className="w-4 h-4 text-market-muted" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[500px] opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function ShopSidebar(props: ShopSidebarProps) {
  const {
    occasion,
    sizes,
    colors,
    minPrice,
    maxPrice,
    minRating,
    expressOnly,
    priceMin,
    priceMax,
    onOccasion,
    onToggleSize,
    onToggleColor,
    onMinPrice,
    onMaxPrice,
    onMinRating,
    onExpressOnly,
    onApplyPrice,
  } = props;

  const ratingOptions = [
    { value: 4, label: "4★ & above" },
    { value: 3, label: "3★ & above" },
    { value: 2, label: "2★ & above" },
    { value: 1, label: "1★ & above" },
  ];

  return (
    <aside className="w-full">
      <FilterSection title="Category">
        <ul className="space-y-2">
          {OCCASIONS.filter((o) => o !== "All").map((o) => (
            <li key={o}>
              <button
                type="button"
                onClick={() => onOccasion(o)}
                className={`text-[13px] hover:text-market-orange transition-colors ${
                  occasion === o ? "text-market-orange font-semibold" : "text-market-text"
                }`}
              >
                {o}
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => onOccasion("All")}
              className={`text-[13px] hover:text-market-orange ${
                occasion === "All" ? "text-market-orange font-semibold" : "text-market-text"
              }`}
            >
              All Teddy Bears
            </button>
          </li>
        </ul>
      </FilterSection>

      <FilterSection title="Express Delivery">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={expressOnly}
            onChange={(e) => onExpressOnly(e.target.checked)}
            className="w-4 h-4 accent-market-orange rounded"
          />
          <span className="text-[13px] text-market-text flex items-center gap-1">
            ⚡ Express eligible only
          </span>
        </label>
      </FilterSection>

      <FilterSection title="Colour">
        <div className="space-y-2 max-h-36 overflow-y-auto">
          {BEAR_COLORS.map((c) => (
            <label key={c} className="flex items-center gap-2 cursor-pointer text-[13px]">
              <input
                type="checkbox"
                checked={colors.includes(c)}
                onChange={() => onToggleColor(c)}
                className="w-4 h-4 accent-market-orange"
              />
              {c}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price (KSh)">
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => onMinPrice(Number(e.target.value))}
              className="market-input flex-1 text-sm py-2"
              placeholder="Min"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => onMaxPrice(Number(e.target.value))}
              className="market-input flex-1 text-sm py-2"
              placeholder="Max"
            />
          </div>
          <input
            type="range"
            min={priceMin}
            max={priceMax}
            step={100}
            value={maxPrice}
            onChange={(e) => onMaxPrice(Number(e.target.value))}
            className="w-full accent-market-orange"
          />
          <button type="button" onClick={onApplyPrice} className="market-btn-outline w-full text-sm py-2">
            Apply
          </button>
        </div>
      </FilterSection>

      <FilterSection title="Product Rating">
        <div className="space-y-2">
          {ratingOptions.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer text-[13px]">
              <input
                type="radio"
                name="rating"
                checked={minRating === value}
                onChange={() => onMinRating(value)}
                className="accent-market-orange"
              />
              <span className="text-market-orange text-sm">★★★★</span>
              <span className="text-market-muted">{label}</span>
            </label>
          ))}
          {minRating > 0 && (
            <button
              type="button"
              onClick={() => onMinRating(0)}
              className="text-xs text-market-orange hover:underline"
            >
              Any rating
            </button>
          )}
        </div>
      </FilterSection>

      <FilterSection title="Size">
        <div className="space-y-2">
          {BEAR_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onToggleSize(s)}
              className={`w-full text-left px-3 py-2 text-[13px] rounded border transition-colors ${
                sizes.includes(s)
                  ? "bg-market-orange text-white border-market-orange"
                  : "bg-white text-market-text border-market-border hover:border-market-orange"
              }`}
            >
              <span className="font-semibold">{getSizeLabel(s)}</span>
              <span className={`ml-1.5 text-[11px] ${sizes.includes(s) ? "text-white/90" : "text-market-muted"}`}>
                ({s})
              </span>
            </button>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}
