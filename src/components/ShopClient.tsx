"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Zap } from "lucide-react";
import { filterProducts } from "@/lib/filterProducts";
import { getProductMarketMeta, MARKETPLACE_SORT_OPTIONS } from "@/lib/marketplace";
import { useCatalogLoaded, useCatalogLoading, useProducts } from "@/hooks/useCatalog";
import ProductGridSkeleton from "@/components/loading/ProductGridSkeleton";
import { Suspense } from "react";
import SizeCategoryBar from "@/components/SizeCategoryBar";
import { getSizeLabel } from "@/lib/sizeCategories";
import ShopSidebar from "@/components/marketplace/ShopSidebar";
import ShopProductCard from "@/components/marketplace/ShopProductCard";
import ShopPagination from "@/components/marketplace/ShopPagination";
import type { BearColor, BearSize } from "@/types/product";
import EmptyState from "@/components/EmptyState";
import { Search } from "lucide-react";
import {
  SHOP_PRICE_MIN,
  SHOP_PRICE_MAX,
  catalogPriceMax,
} from "@/lib/shopPriceRange";

const PAGE_SIZE = 24;
const PRICE_MIN = SHOP_PRICE_MIN;

export default function ShopClient() {
  const searchParams = useSearchParams();
  const occasionParam = searchParams.get("occasion") || "All";
  const brandParam = searchParams.get("brand") || "";
  const sizeParam = searchParams.get("size") as BearSize | null;
  const queryParam = searchParams.get("q")?.trim().toLowerCase() || "";

  const [occasion, setOccasion] = useState(occasionParam);
  const [brand, setBrand] = useState(brandParam);
  const [sizes, setSizes] = useState<BearSize[]>(sizeParam ? [sizeParam] : []);
  const [colors, setColors] = useState<BearColor[]>([]);
  const [minPrice, setMinPrice] = useState(PRICE_MIN);
  const [maxPrice, setMaxPrice] = useState(SHOP_PRICE_MAX);
  const [expressOnly, setExpressOnly] = useState(false);
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const runFilter = useCallback((fn: () => void) => {
    fn();
  }, []);

  const allProducts = useProducts();
  const catalogLoading = useCatalogLoading();
  const catalogLoaded = useCatalogLoaded();
  const priceCap = useMemo(
    () => catalogPriceMax(allProducts.map((p) => p.price)),
    [allProducts]
  );

  useEffect(() => {
    if (allProducts.length && maxPrice < priceCap) {
      setMaxPrice(priceCap);
    }
  }, [allProducts.length, priceCap, maxPrice]);

  useEffect(() => {
    setOccasion(occasionParam);
    setPage(1);
  }, [occasionParam]);

  useEffect(() => {
    setBrand(brandParam);
    setPage(1);
  }, [brandParam]);

  useEffect(() => {
    if (sizeParam) setSizes([sizeParam]);
  }, [sizeParam]);

  const filtered = useMemo(() => {
    let result = filterProducts(allProducts, {
      occasion,
      brand: brand || undefined,
      sizes: sizes.length ? sizes : undefined,
      colors: colors.length ? colors : undefined,
      minPrice,
      maxPrice,
      sort,
    });

    if (expressOnly) {
      result = result.filter((p) => getProductMarketMeta(p).express);
    }

    if (queryParam) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(queryParam) ||
          p.brand.toLowerCase().includes(queryParam) ||
          p.tagline.toLowerCase().includes(queryParam) ||
          p.occasions.some((o) => o.toLowerCase().includes(queryParam))
      );
    }

    return result;
  }, [
    allProducts,
    occasion,
    brand,
    sizes,
    colors,
    minPrice,
    maxPrice,
    sort,
    expressOnly,
    queryParam,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilters = useMemo(() => {
    const tags: { key: string; label: string; clear: () => void }[] = [];
    if (occasion !== "All") tags.push({ key: "occ", label: occasion, clear: () => setOccasion("All") });
    if (brand) tags.push({ key: "brand", label: brand, clear: () => setBrand("") });
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
    if (minPrice > PRICE_MIN || maxPrice < priceCap) {
      tags.push({
        key: "price",
        label: `KSh ${minPrice.toLocaleString()} – ${maxPrice.toLocaleString()}`,
        clear: () => {
          setMinPrice(PRICE_MIN);
          setMaxPrice(priceCap);
        },
      });
    }
    if (expressOnly) {
      tags.push({ key: "express", label: "Express", clear: () => setExpressOnly(false) });
    }
    return tags;
  }, [occasion, brand, sizes, colors, minPrice, maxPrice, expressOnly, priceCap]);

  const clearAll = () => {
    runFilter(() => {
      setOccasion("All");
      setBrand("");
      setSizes([]);
      setColors([]);
      setMinPrice(PRICE_MIN);
      setMaxPrice(priceCap);
      setExpressOnly(false);
      setPage(1);
    });
  };

  const toggleSize = (s: BearSize) => {
    runFilter(() => {
      setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
      setPage(1);
    });
  };

  const toggleColor = (c: BearColor) => {
    runFilter(() => {
      setColors((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
      setPage(1);
    });
  };

  const brandOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of allProducts) {
      const name =
        p.brand ||
        (p.tagline.endsWith(" collection")
          ? p.tagline.replace(/ collection$/i, "")
          : "");
      if (!name) continue;
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [allProducts]);

  const sidebarProps = {
    occasion,
    brand,
    brandOptions,
    onBrand: (v: string) => {
      runFilter(() => {
        setBrand(v);
        setPage(1);
      });
    },
    sizes,
    colors,
    minPrice,
    maxPrice,
    expressOnly,
    priceMin: PRICE_MIN,
    priceMax: priceCap,
    onOccasion: (v: string) => {
      runFilter(() => {
        setOccasion(v);
        setPage(1);
      });
    },
    onToggleSize: toggleSize,
    onToggleColor: toggleColor,
    onMinPrice: setMinPrice,
    onMaxPrice: setMaxPrice,
    onExpressOnly: (v: boolean) => {
      runFilter(() => {
        setExpressOnly(v);
        setPage(1);
      });
    },
    onApplyPrice: () => runFilter(() => setPage(1)),
  };

  return (
    <div className="shop-page">
      <div className="shop-page-header">
        <div className="container-main py-6 md:py-8">
          <p className="shop-breadcrumb mb-2">
            <Link href="/">Home</Link>
            {" / "}
            <span className="text-ink-muted">Shop</span>
          </p>
          <p className="section-eyebrow mb-2">Our collection</p>
          <h1 className="section-title">
            Teddy Bears
            {queryParam && (
              <span className="text-ink-muted font-normal text-base ml-2">
                — &quot;{searchParams.get("q")}&quot;
              </span>
            )}
          </h1>
        </div>
      </div>

      <div className="container-main py-6">
        <div className="mb-6">
          <p className="shop-label mb-3">Shop by size</p>
          <Suspense fallback={null}>
            <SizeCategoryBar />
          </Suspense>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar — desktop */}
          <div className="hidden lg:block w-[260px] shrink-0">
            <div className="sticky top-[128px] shop-panel p-5">
              <h2 className="font-display text-lg font-medium text-ink mb-3">Filters</h2>
              <ShopSidebar {...sidebarProps} />
            </div>
          </div>

          {/* Main column */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="shop-panel p-4 md:p-5 mb-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-ink-muted">
                  <span className="text-ink font-semibold">
                    {filtered.length.toLocaleString()}
                  </span>
                  {allProducts.length > 0 && filtered.length !== allProducts.length
                    ? ` of ${allProducts.length.toLocaleString()} bears`
                    : allProducts.length > 0
                      ? ` bears — full catalog`
                      : " products"}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      runFilter(() => setExpressOnly((v) => !v))
                    }
                    className={`shop-chip ${expressOnly ? "shop-chip-active" : ""}`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Express
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterOpen(true)}
                    className="lg:hidden shop-chip"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filter
                  </button>
                  <select
                    value={sort}
                    onChange={(e) => {
                      runFilter(() => {
                        setSort(e.target.value);
                        setPage(1);
                      });
                    }}
                    className="shop-select w-auto min-w-[180px]"
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
                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-caramel/10">
                  {activeFilters.map((tag) => (
                    <button
                      key={tag.key}
                      type="button"
                      onClick={tag.clear}
                      className="shop-filter-tag"
                    >
                      {tag.label}
                      <X className="w-3 h-3" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-xs font-semibold text-caramel hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Grid */}
            {!catalogLoaded || (catalogLoading && allProducts.length === 0) ? (
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
              <div className="shop-grid">
                {pageItems.map((product, index) => (
                  <ShopProductCard
                    key={product.id}
                    product={product}
                    priority={page === 1 && index < 4}
                  />
                ))}
              </div>
            )}

            <ShopPagination
              page={page}
              totalPages={totalPages}
              onPage={(p) => runFilter(() => setPage(p))}
            />
          </div>
        </div>

        {/* SEO block */}
        <section className="mt-12 shop-panel p-6 md:p-8 text-sm text-ink-muted leading-relaxed">
          <h2 className="font-display text-xl font-medium text-ink mb-3">
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
          <div className="shop-drawer-overlay" onClick={() => setFilterOpen(false)} />
          <div className="shop-drawer-panel">
            <div className="sticky top-0 bg-ivory border-b border-caramel/10 p-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-medium text-ink">Filters</h2>
              <button type="button" onClick={() => setFilterOpen(false)} aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <ShopSidebar {...sidebarProps} />
            </div>
            <div className="sticky bottom-0 p-4 bg-ivory border-t border-caramel/10">
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="btn-primary w-full"
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
