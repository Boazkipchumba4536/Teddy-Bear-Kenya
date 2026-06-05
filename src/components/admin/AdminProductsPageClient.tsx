"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Tags, Package } from "lucide-react";
import {
  adminDeleteProduct,
  adminListProducts,
  type AdminProductListResult,
} from "@/lib/actions/admin";
import { removeProductFromCatalog } from "@/lib/refreshCatalog";
import { toastError, toastSuccess } from "@/store/toastStore";
import { formatKES } from "@/lib/format";
import BulkCategorizePanel from "@/components/admin/BulkCategorizePanel";
import { getProductDisplayImage } from "@/lib/productDisplayImage";
import { IMAGE_FALLBACK } from "@/lib/images";
import type { Product } from "@/types/product";

const PAGE_SIZE = 50;

function AdminThumb({ product }: { product: Product }) {
  const src = getProductDisplayImage(
    { id: product.id, slug: product.slug, image: product.image },
    "thumb"
  );
  if (src === IMAGE_FALLBACK) {
    return (
      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
        <Package className="w-5 h-5 text-gray-400" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt=""
      width={48}
      height={48}
      loading="lazy"
      decoding="async"
      className="w-12 h-12 rounded-lg object-cover shrink-0 bg-gray-100"
    />
  );
}

export default function AdminProductsPageClient() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [listPage, setListPage] = useState(1);
  const [data, setData] = useState<AdminProductListResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [deleting, startDelete] = useTransition();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setListPage(1);
  }, [debouncedSearch]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminListProducts({
        page: listPage,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
      });
      setData(result);
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to load products");
      setData({ items: [], total: 0, page: 1, pageSize: PAGE_SIZE });
    } finally {
      setLoading(false);
    }
  }, [listPage, debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleDelete = (id: string) => {
    startDelete(async () => {
      try {
        await adminDeleteProduct(id);
        removeProductFromCatalog(id);
        setConfirmDelete(null);
        toastSuccess("Product deleted");
        await load();
      } catch (err) {
        toastError(err instanceof Error ? err.message : "Failed to delete product");
      }
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Products</h1>
          <p className="text-ink-muted text-sm mt-1">
            {loading ? "Loading…" : `${total.toLocaleString()} products in catalog`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setBulkOpen((v) => !v)}
            className="btn-outline inline-flex items-center gap-2"
          >
            <Tags className="w-4 h-4" /> Recategorize
          </button>
          <Link href="/admin/products/new" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {bulkOpen && <BulkCategorizePanel onDone={() => { setBulkOpen(false); load(); }} />}

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, slug, or brand…"
          className="input-field pl-10"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-ink-muted text-sm">Loading products…</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-ink-muted">
                    <th className="p-4 font-medium">Product</th>
                    <th className="p-4 font-medium">Brand</th>
                    <th className="p-4 font-medium">Size</th>
                    <th className="p-4 font-medium">Price</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <AdminThumb product={p} />
                          <div className="min-w-0">
                            <p className="font-medium text-ink truncate max-w-[200px]">{p.name}</p>
                            <p className="text-xs text-ink-muted truncate max-w-[200px]">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs">{p.brand || "—"}</td>
                      <td className="p-4">{p.size}</td>
                      <td className="p-4 font-semibold text-accent">{formatKES(p.price)}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {!p.inStock && (
                            <span className="text-[10px] font-bold uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                              Out of stock
                            </span>
                          )}
                          {p.featured && (
                            <span className="text-[10px] font-bold uppercase bg-violet/10 text-violet px-2 py-0.5 rounded-full">
                              Featured
                            </span>
                          )}
                          {p.badge && (
                            <span className="text-[10px] font-bold uppercase bg-blush text-ink px-2 py-0.5 rounded-full">
                              {p.badge}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${p.id}`}
                            prefetch={false}
                            className="p-2 rounded-lg hover:bg-violet/10 text-violet"
                            aria-label="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          {confirmDelete === p.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={deleting}
                                onClick={() => handleDelete(p.id)}
                                className="text-xs bg-red-600 text-white px-2 py-1 rounded-lg"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDelete(null)}
                                className="text-xs px-2 py-1 rounded-lg border"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDelete(p.id)}
                              className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                              aria-label="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {items.length === 0 && (
              <p className="text-center text-ink-muted py-12">No products found.</p>
            )}
            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-4 p-4 border-t border-gray-100 text-sm">
                <p className="text-ink-muted">
                  Page {listPage} of {totalPages}
                  {debouncedSearch ? ` · matching “${debouncedSearch}”` : ""}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={listPage <= 1 || loading}
                    onClick={() => setListPage((p) => Math.max(1, p - 1))}
                    className="shop-page-btn"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={listPage >= totalPages || loading}
                    onClick={() => setListPage((p) => Math.min(totalPages, p + 1))}
                    className="shop-page-btn"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
