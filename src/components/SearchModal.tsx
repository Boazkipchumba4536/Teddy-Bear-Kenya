"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import OptimizedProductImage from "@/components/OptimizedProductImage";
import { Search, X } from "lucide-react";
import { useProducts } from "@/hooks/useCatalog";
import { formatKES } from "@/lib/format";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const products = useProducts();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const results = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return products.slice(0, 6);
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.occasions.some((o) => o.toLowerCase().includes(q))
      )
      .slice(0, 24);
  }, [products, debouncedQuery]);

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute top-0 inset-x-0 bg-cream shadow-elevated max-h-[85vh] overflow-hidden flex flex-col">
        <div className="container-main py-4 flex items-center gap-3 border-b border-caramel/10">
          <Search className="w-5 h-5 text-ink-muted shrink-0" />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bears, occasions…"
            className="flex-1 bg-transparent text-ink placeholder:text-ink-light outline-none text-base min-h-[44px]"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-2 rounded-full hover:bg-caramel/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 container-main py-4">
          {results.length === 0 ? (
            <p className="text-center text-ink-muted py-8">No bears found for &ldquo;{query}&rdquo;</p>
          ) : (
            <ul className="space-y-2">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/shop/${p.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white transition-colors"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-blush/20">
                      <OptimizedProductImage
                        productId={p.id}
                        slug={p.slug}
                        src={p.image}
                        alt={p.name}
                        variant="thumb"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-ink line-clamp-1">{p.name}</p>
                      <p className="text-xs text-ink-muted line-clamp-1">{p.tagline}</p>
                    </div>
                    <p className="text-sm font-semibold text-caramel shrink-0">{formatKES(p.price)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
