"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import ProductCard from "@/components/ProductCard";
import ShopHero from "@/components/ShopHero";
import { useStore } from "@/context/StoreContext";
import type { Product } from "@/lib/types";

const PER_PAGE = 12;

type SortKey =
  | "default"
  | "popularity"
  | "rating"
  | "latest"
  | "price-asc"
  | "price-desc";

function sortProducts(list: Product[], sort: SortKey): Product[] {
  const copy = [...list];
  switch (sort) {
    case "popularity":
      return copy.sort((a, b) => b.popularity - a.popularity);
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    case "latest":
      return copy.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "price-asc":
      return copy.sort(
        (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price)
      );
    case "price-desc":
      return copy.sort(
        (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price)
      );
    default:
      return copy;
  }
}

export default function ShopClient() {
  const searchParams = useSearchParams();
  const { wishlist } = useStore();

  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const wishlistOnly = searchParams.get("wishlist") === "1";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

  const [sort, setSort] = useState<SortKey>("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [localCategory, setLocalCategory] = useState(category);

  const filtered = useMemo(() => {
    let list = products;
    if (wishlistOnly) {
      list = list.filter((p) => wishlist.includes(p.id));
    }
    if (localCategory) {
      list = list.filter((p) => p.category === localCategory);
    }
    if (q) {
      const lower = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.tags.some((t) => t.includes(lower))
      );
    }
    const min = minPrice ? parseInt(minPrice, 10) : 0;
    const max = maxPrice ? parseInt(maxPrice, 10) : Infinity;
    list = list.filter((p) => {
      const price = p.salePrice ?? p.price;
      return price >= min && price <= max;
    });
    return sortProducts(list, sort);
  }, [q, localCategory, minPrice, maxPrice, sort, wishlistOnly, wishlist]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <>
      {!wishlistOnly && <ShopHero />}
      <div className="container-main py-10 md:py-14">
        {wishlistOnly && (
          <div className="mb-10">
            <h1 className="section-title mb-2">My Wishlist</h1>
            <p className="text-ink-muted">
              {filtered.length} saved item{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}

        {!wishlistOnly && (
          <p className="text-ink-muted mb-8 text-sm">
            Showing{" "}
            {paginated.length > 0 ? (page - 1) * PER_PAGE + 1 : 0}–
            {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} results
            {q && (
              <>
                {" "}
                for &ldquo;<span className="text-wine font-medium">{q}</span>&rdquo;
              </>
            )}
          </p>
        )}

      <div className="flex flex-col lg:flex-row gap-8">
        <aside
          className={`lg:w-64 shrink-0 space-y-6 ${
            filtersOpen ? "block" : "hidden lg:block"
          }`}
        >
          <div className="card p-5">
            <h2 className="font-semibold mb-4">Filter by price</h2>
            <div className="flex gap-2 mb-3">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="input-field text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="input-field text-sm"
              />
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold mb-4">Categories</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => setLocalCategory("")}
                  className={`hover:text-wine transition ${!localCategory ? "text-wine font-semibold" : "text-ink-muted"}`}
                >
                  All products ({products.length})
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => setLocalCategory(cat.id)}
                    className={`hover:text-wine transition ${
                      localCategory === cat.id
                        ? "text-wine font-semibold"
                        : "text-ink-muted"
                    }`}
                  >
                    {cat.name} ({cat.count})
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <button
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="lg:hidden btn-secondary py-2 px-4 text-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="input-field w-auto text-sm ml-auto"
              aria-label="Sort products"
            >
              <option value="default">Default sorting</option>
              <option value="popularity">Sort by popularity</option>
              <option value="rating">Sort by average rating</option>
              <option value="latest">Sort by latest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>

          {paginated.length === 0 ? (
            <div className="text-center py-20 text-ink-muted">
              <p className="text-4xl mb-4">🔍</p>
              <p>No products found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10">
              {paginated.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav
              className="flex justify-center gap-2 mt-10"
              aria-label="Pagination"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/shop?page=${p}${q ? `&q=${q}` : ""}${localCategory ? `&category=${localCategory}` : ""}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition ${
                    p === page
                      ? "bg-ink text-white"
                      : "bg-white border border-ink/10 hover:bg-sand"
                  }`}
                >
                  {p}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
