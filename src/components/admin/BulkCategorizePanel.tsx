"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { BearColor, BearSize, Occasion, Product } from "@/types/product";
import { BEAR_SIZES, OCCASIONS } from "@/lib/products";
import { BEAR_COLORS } from "@/lib/bearColors";
import { mergeBrandOptions } from "@/lib/brands";
import { adminBulkUpdateProducts, adminFetchProductsForBulk } from "@/lib/actions/admin";
import { toastError, toastSuccess } from "@/store/toastStore";

const occasionOptions = OCCASIONS.filter((o) => o !== "All") as Occasion[];

type Props = {
  onDone: () => void;
};

export default function BulkCategorizePanel({ onDone }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingBulk, setLoadingBulk] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [brand, setBrand] = useState("");
  const [size, setSize] = useState<BearSize | "">("");
  const [color, setColor] = useState<BearColor | "">("");
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [inStock, setInStock] = useState<"" | "yes" | "no">("");
  const [filterBrand, setFilterBrand] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    adminFetchProductsForBulk()
      .then((rows) => {
        if (!cancelled) setProducts(rows);
      })
      .catch((err) => {
        if (!cancelled) toastError(err instanceof Error ? err.message : "Failed to load products");
      })
      .finally(() => {
        if (!cancelled) setLoadingBulk(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const brandOptions = useMemo(
    () => mergeBrandOptions(products.map((p) => p.brand).filter(Boolean)),
    [products]
  );

  const filtered = useMemo(() => {
    if (!filterBrand) return products;
    return products.filter((p) => p.brand === filterBrand);
  }, [products, filterBrand]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllFiltered = () => {
    setSelected(new Set(filtered.map((p) => p.id)));
  };

  const apply = () => {
    const ids = Array.from(selected);
    if (!ids.length) {
      toastError("Select at least one product");
      return;
    }

    const patch: Parameters<typeof adminBulkUpdateProducts>[1] = {};
    if (brand) patch.brand = brand;
    if (size) patch.size = size;
    if (color) patch.color = color;
    if (occasions.length) patch.occasions = occasions;
    if (inStock === "yes") patch.inStock = true;
    if (inStock === "no") patch.inStock = false;

    if (!Object.keys(patch).length) {
      toastError("Choose at least one field to update");
      return;
    }

    startTransition(async () => {
      try {
        await adminBulkUpdateProducts(ids, patch);
        setProducts((prev) =>
          prev.map((p) => {
            if (!ids.includes(p.id)) return p;
            return {
              ...p,
              ...(patch.brand ? { brand: patch.brand } : {}),
              ...(patch.size ? { size: patch.size } : {}),
              ...(patch.color ? { color: patch.color } : {}),
              ...(patch.occasions ? { occasions: patch.occasions } : {}),
              ...(patch.inStock !== undefined ? { inStock: patch.inStock } : {}),
            };
          })
        );
        toastSuccess(`Updated ${ids.length} products`);
        setSelected(new Set());
        onDone();
      } catch (err) {
        toastError(err instanceof Error ? err.message : "Bulk update failed");
      }
    });
  };

  if (loadingBulk) {
    return (
      <div className="bg-cream/50 border border-caramel/20 rounded-2xl p-8 mb-8 text-center text-sm text-ink-muted">
        Loading products for bulk edit…
      </div>
    );
  }

  return (
    <div className="bg-cream/50 border border-caramel/20 rounded-2xl p-5 mb-8 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-medium text-ink">Bulk recategorize</h2>
          <p className="text-xs text-ink-muted mt-1">
            Select products, set brand / occasion / size / stock, then apply.
          </p>
        </div>
        <button type="button" onClick={onDone} className="text-sm text-ink-muted hover:text-caramel">
          Close
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs font-medium block mb-1">Filter by brand</label>
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="input-field py-2 text-sm min-w-[160px]"
          >
            <option value="">All brands</option>
            {brandOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <button type="button" onClick={selectAllFiltered} className="btn-outline text-sm py-2">
          Select all shown ({filtered.length})
        </button>
        <span className="text-sm text-ink-muted">{selected.size} selected</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="text-xs font-medium block mb-1">Set brand</label>
          <select value={brand} onChange={(e) => setBrand(e.target.value)} className="input-field py-2 text-sm">
            <option value="">— leave —</option>
            {brandOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Set size</label>
          <select value={size} onChange={(e) => setSize(e.target.value as BearSize | "")} className="input-field py-2 text-sm">
            <option value="">— leave —</option>
            {BEAR_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Set color</label>
          <select value={color} onChange={(e) => setColor(e.target.value as BearColor | "")} className="input-field py-2 text-sm">
            <option value="">— leave —</option>
            {BEAR_COLORS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium block mb-1">Stock</label>
          <select value={inStock} onChange={(e) => setInStock(e.target.value as "" | "yes" | "no")} className="input-field py-2 text-sm">
            <option value="">— leave —</option>
            <option value="yes">In stock</option>
            <option value="no">Out of stock</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium block mb-2">Set occasions (replaces current)</label>
        <div className="flex flex-wrap gap-2">
          {occasionOptions.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() =>
                setOccasions((prev) =>
                  prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]
                )
              }
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                occasions.includes(o) ? "bg-caramel text-white border-caramel" : "border-gray-200"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-48 overflow-y-auto border border-caramel/10 rounded-xl bg-white divide-y divide-gray-50">
        {filtered.slice(0, 80).map((p) => (
          <label
            key={p.id}
            className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50/80"
          >
            <input
              type="checkbox"
              checked={selected.has(p.id)}
              onChange={() => toggle(p.id)}
              className="accent-caramel"
            />
            <span className="truncate flex-1">{p.name}</span>
            <span className="text-xs text-ink-muted shrink-0">{p.brand || "—"}</span>
          </label>
        ))}
        {filtered.length > 80 && (
          <p className="text-xs text-ink-muted p-3">Showing first 80 — narrow with brand filter.</p>
        )}
      </div>

      <button
        type="button"
        disabled={pending || selected.size === 0}
        onClick={apply}
        className="btn-primary bg-caramel disabled:opacity-50"
      >
        {pending ? "Applying…" : `Apply to ${selected.size} product(s)`}
      </button>
    </div>
  );
}
