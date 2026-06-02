"use client";

import { useState, useMemo, useEffect } from "react";
import { site } from "@/lib/site";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Zap } from "lucide-react";
import { filterProducts } from "@/lib/products";
import { getProductMarketMeta, MARKETPLACE_SORT_OPTIONS } from "@/lib/marketplace";
import { useCatalogLoading, useProducts } from "@/hooks/useCatalog";
import ProductGridSkeleton from "@/components/loading/ProductGridSkeleton";
import { Suspense } from "react";
import OccasionCategoryGrid from "@/components/OccasionCategoryGrid";
import SizeCategoryBar from "@/components/SizeCategoryBar";
import { getSizeLabel } from "@/lib/sizeCategories";
import ShopSidebar from "@/components/marketplace/ShopSidebar";
import ShopProductCard from "@/components/marketplace/ShopProductCard";
import ShopPagination from "@/components/marketplace/ShopPagination";
import type { BearColor, BearSize } from "@/types/product";
import EmptyState from "@/components/EmptyState";
import { Search } from "lucide-react";

const PAGE_SIZE = 16;
const PRICE_MIN = 500;
const PRICE_MAX = 15000;

export default function ShopClient() {
  const searchParams = useSearchParams();
  const occasionParam = searchParams.get("occasion") || "All";
  const sizeParam = searchParams.get("size") as BearSize | null;
  const queryParam = searchParams.get("q")?.trim().toLowerCase() || "";

  const [occasion, setOccasion] = useState(occasionParam);
  const [sizes, setSizes] = useState<BearSize[]>(sizeParam ? [sizeParam] : []);
  const [colors, setColors] = useState<BearColor[]>([]);
  const [minPrice, setMinPrice] = useState(PRICE_MIN);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [minRating, setMinRating] = useState(0);
  const [expressOnly, setExpressOnly] = useState(false);
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const allProducts = useProducts();
  const catalogLoading = useCatalogLoading();

  useEffect(() => {
    setOccasion(occasionParam);
    setPage(1);
  }, [occasionParam]);

  useEffect(() => {
    if (sizeParam) setSizes([sizeParam]);
  }, [sizeParam]);

  const filtered = useMemo(() => {
    let result = filterProducts(allProducts, {
      occasion,
      sizes: sizes.length ? sizes : undefined,
      colors: colors.length ? colors : undefined,
      minPrice,
      maxPrice,
      sort: sort === "rating" ? "featured" : sort,
    });

    if (expressOnly) {
      result = result.filter((p) => getProductMarketMeta(p).express);
    }
    if (minRating > 0) {
      result = result.filter((p) => getProductMarketMeta(p).rating >= minRating);
    }
    if (sort === "rating") {
      result = [...result].sort(
        (a, b) => getProductMarketMeta(b).rating - getProductMarketMeta(a).rating
      );
    }

    if (queryParam) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(queryParam) ||
          p.tagline.toLowerCase().includes(queryParam) ||
          p.occasions.some((o) => o.toLowerCase().includes(queryParam))
      );
    }

    return result;
  }, [
    allProducts,
    occasion,
    sizes,
    colors,
    minPrice,
    maxPrice,
    sort,
    expressOnly,
    minRating,
    queryParam,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilters = useMemo(() => {
    const tags: { key: string; label: string; clear: () => void }[] = [];
    if (occasion !== "All") tags.push({ key: "occ", label: occasion, clear: () => setOccasion("All") });
    sizes.forEach((s) =>
      tags.push({
        key: `size-${s}`,
        label: `Size: ${getSizeLabel(s)}`,
        clear: () => setSizes((prev) => prev.filter((x) => x !== s)),
      })
    );
    colors.forEach((c) =>
      tags.push({
        key: `color-${c}`,
        label: c,
        clear: () => setColors((prev) => prev.filter((x) => x !== c)),
      })
    );
    if (minPrice > PRICE_MIN || maxPrice < PRICE_MAX) {
      tags.push({
        key: "price",
        label: `KSh ${minPrice.toLocaleString()} – ${maxPrice.toLocaleString()}`,
        clear: () => {
          setMinPrice(PRICE_MIN);
          setMaxPrice(PRICE_MAX);
        },
      });
    }
    if (minRating > 0) {
      tags.push({
        key: "rating",
        label: `${minRating}★+`,
        clear: () => setMinRating(0),
      });
    }
    if (expressOnly) {
      tags.push({ key: "express", label: "Express", clear: () => setExpressOnly(false) });
    }
    return tags;
  }, [occasion, sizes, colors, minPrice, maxPrice, minRating, expressOnly]);

  const clearAll = () => {
    setOccasion("All");
    setSizes([]);
    setColors([]);
    setMinPrice(PRICE_MIN);
    setMaxPrice(PRICE_MAX);
    setMinRating(0);
    setExpressOnly(false);
    setPage(1);
  };

  const toggleSize = (s: BearSize) => {
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
    setPage(1);
  };

  const toggleColor = (c: BearColor) => {
    setColors((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
    setPage(1);
  };

  const sidebarProps = {
    occasion,
    sizes,
    colors,
    minPrice,
    maxPrice,
    minRating,
    expressOnly,
    priceMin: PRICE_MIN,
    priceMax: PRICE_MAX,
    onOccasion: (v: string) => {
      setOccasion(v);
      setPage(1);
    },
    onToggleSize: toggleSize,
    onToggleColor: toggleColor,
    onMinPrice: setMinPrice,
    onMaxPrice: setMaxPrice,
    onMinRating: (v: number) => {
      setMinRating(v);
      setPage(1);
    },
    onExpressOnly: (v: boolean) => {
      setExpressOnly(v);
      setPage(1);
    },
    onApplyPrice: () => setPage(1),
  };

  return (
    <div className="bg-market-gray min-h-screen">
      {/* Breadcrumb-style header */}
      <div className="bg-white border-b border-market-border">
        <div className="container-main py-4">
          <p className="text-[12px] text-market-muted mb-1">
            Home / Toys &amp; Games / <span className="text-market-text">Teddy Bears</span>
          </p>
          <h1 className="text-xl md:text-2xl font-bold text-market-dark">
            Teddy Bears
            {queryParam && (
              <span className="text-market-muted font-normal text-base ml-2">
                — &quot;{searchParams.get("q")}&quot;
              </span>
            )}
          </h1>
        </div>
      </div>

      <div className="container-main py-6">
        <div className="mb-6 space-y-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-market-muted mb-2">
              Shop by occasion
            </p>
            <OccasionCategoryGrid mode="link" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-market-muted mb-2">
              Shop by size
            </p>
            <Suspense fallback={null}>
              <SizeCategoryBar />
            </Suspense>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar — desktop */}
          <div className="hidden lg:block w-[260px] shrink-0">
            <div className="sticky top-[128px] bg-white rounded border border-market-border p-4 shadow-market">
              <h2 className="text-sm font-bold text-market-dark mb-2">Filters</h2>
              <ShopSidebar {...sidebarProps} />
            </div>
          </div>

          {/* Main column */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="bg-white rounded border border-market-border p-4 mb-4 shadow-market">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[13px] text-market-muted">
                  <span className="text-market-dark font-semibold">
                    ({filtered.length.toLocaleString()} products found)
                  </span>
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setExpressOnly(!expressOnly)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-bold rounded-full border transition-colors ${
                      expressOnly
                        ? "bg-market-orange text-white border-market-orange"
                        : "bg-white text-market-orange border-market-orange"
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Express
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterOpen(true)}
                    className="lg:hidden market-btn-outline text-sm py-2 px-3"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filter
                  </button>
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setPage(1);
                    }}
                    className="market-input text-[13px] py-2 w-auto min-w-[160px]"
                  >
                    {MARKETPLACE_SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        Sort: {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-market-border">
                  {activeFilters.map((tag) => (
                    <button
                      key={tag.key}
                      type="button"
                      onClick={tag.clear}
                      className="inline-flex items-center gap-1 bg-market-orange/10 text-market-orange text-[12px] font-semibold px-2.5 py-1 rounded-full border border-market-orange/30 hover:bg-market-orange/20"
                    >
                      {tag.label}
                      <X className="w-3 h-3" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-[12px] font-semibold text-market-orange hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Grid */}
            {catalogLoading ? (
              <ProductGridSkeleton count={8} />
            ) : pageItems.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No teddy bears match your filters"
                description="Try adjusting filters or browse our full collection."
                actionLabel="Clear filters"
                actionHref="/shop"
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {pageItems.map((product) => (
                  <ShopProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <ShopPagination page={page} totalPages={totalPages} onPage={setPage} />
          </div>
        </div>

        {/* SEO block */}
        <section className="mt-12 bg-white border border-market-border rounded p-6 text-[13px] text-market-muted leading-relaxed">
          <h2 className="text-base font-bold text-market-dark mb-2">
            Buy Teddy Bears online in Kenya
          </h2>
          <p>
            Shop for teddy bears online at {site.name}.
            Enjoy safe shopping, M-Pesa payments, and delivery across Kenya. Our range includes
            giant teddy bears, Valentine plush, birthday bears, and personalised gifts — with
            express delivery in Nairobi on selected items.
          </p>
        </section>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
          <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-xl max-h-[85vh] overflow-y-auto shadow-elevated">
            <div className="sticky top-0 bg-white border-b border-market-border p-4 flex items-center justify-between">
              <h2 className="font-bold text-market-dark">Filters</h2>
              <button type="button" onClick={() => setFilterOpen(false)} aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <ShopSidebar {...sidebarProps} />
            </div>
            <div className="sticky bottom-0 p-4 bg-white border-t border-market-border">
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="w-full bg-market-orange text-white font-bold py-3 rounded text-sm"
              >
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
