"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  BEAR_SIZES,
  OCCASIONS,
} from "@/lib/products";
import { BEAR_COLORS, bearColorSwatchStyle } from "@/lib/bearColors";
import { getSizeLabel } from "@/lib/sizeCategories";
import type { BearColor, BearSize } from "@/types/product";

interface ShopSidebarProps {
  occasion: string;
  brand: string;
  brandOptions: [string, number][];
  onBrand: (v: string) => void;
  sizes: BearSize[];
  colors: BearColor[];
  minPrice: number;
  maxPrice: number;
  expressOnly: boolean;
  priceMin: number;
  priceMax: number;
  onOccasion: (v: string) => void;
  onToggleSize: (s: BearSize) => void;
  onToggleColor: (c: BearColor) => void;
  onMinPrice: (v: number) => void;
  onMaxPrice: (v: number) => void;
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
    <div className="border-b border-caramel/10 py-4 first:pt-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="shop-label">{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-ink-light" />
        ) : (
          <ChevronDown className="w-4 h-4 text-ink-light" />
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
    brand,
    brandOptions,
    onBrand,
    sizes,
    colors,
    minPrice,
    maxPrice,
    expressOnly,
    priceMin,
    priceMax,
    onOccasion,
    onToggleSize,
    onToggleColor,
    onMinPrice,
    onMaxPrice,
    onExpressOnly,
    onApplyPrice,
  } = props;

  return (
    <aside className="w-full">
      {brandOptions.length > 0 && (
        <FilterSection title="Brand">
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            <li>
              <button
                type="button"
                onClick={() => onBrand("")}
                className={`text-sm hover:text-caramel transition-colors ${
                  !brand ? "text-caramel font-semibold" : "text-ink-muted"
                }`}
              >
                All brands
              </button>
            </li>
            {brandOptions.map(([name, count]) => (
              <li key={name}>
                <button
                  type="button"
                  onClick={() => onBrand(name)}
                  className={`text-sm hover:text-caramel transition-colors text-left ${
                    brand === name ? "text-caramel font-semibold" : "text-ink-muted"
                  }`}
                >
                  {name}
                  <span className="text-ink-light ml-1">({count})</span>
                </button>
              </li>
            ))}
          </ul>
        </FilterSection>
      )}

      <FilterSection title="Category">
        <ul className="space-y-2">
          {OCCASIONS.filter((o) => o !== "All").map((o) => (
            <li key={o}>
              <button
                type="button"
                onClick={() => onOccasion(o)}
                className={`text-sm hover:text-caramel transition-colors ${
                  occasion === o ? "text-caramel font-semibold" : "text-ink-muted"
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
              className={`text-sm hover:text-caramel ${
                occasion === "All" ? "text-caramel font-semibold" : "text-ink-muted"
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
            className="w-4 h-4 accent-caramel rounded"
          />
          <span className="text-sm text-ink-muted flex items-center gap-1">
            ⚡ Express eligible only
          </span>
        </label>
      </FilterSection>

      <FilterSection title="Colour">
        <div className="space-y-2 max-h-36 overflow-y-auto">
          {BEAR_COLORS.map((c) => (
            <label key={c} className="flex items-center gap-2 cursor-pointer text-sm text-ink-muted">
              <input
                type="checkbox"
                checked={colors.includes(c)}
                onChange={() => onToggleColor(c)}
                className="w-4 h-4 accent-caramel rounded"
              />
              <span
                className="w-4 h-4 rounded-full border border-ink/15 shrink-0"
                style={bearColorSwatchStyle(c)}
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
              className="shop-select flex-1 text-sm py-2 min-h-0"
              placeholder="Min"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => onMaxPrice(Number(e.target.value))}
              className="shop-select flex-1 text-sm py-2 min-h-0"
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
            className="w-full accent-caramel"
          />
          <button type="button" onClick={onApplyPrice} className="btn-outline w-full text-sm py-2 min-h-0">
            Apply
          </button>
        </div>
      </FilterSection>

      <FilterSection title="Size">
        <div className="space-y-2">
          {BEAR_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onToggleSize(s)}
              className={`w-full text-left px-3 py-2.5 text-sm rounded-xl border transition-all duration-200 ${
                sizes.includes(s)
                  ? "bg-caramel text-white border-caramel shadow-soft"
                  : "bg-white text-ink-muted border-caramel/15 hover:border-caramel/40"
              }`}
            >
              <span className="font-semibold">{getSizeLabel(s)}</span>
              <span className={`ml-1.5 text-[11px] ${sizes.includes(s) ? "text-white/90" : "text-ink-light"}`}>
                ({s})
              </span>
            </button>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}
