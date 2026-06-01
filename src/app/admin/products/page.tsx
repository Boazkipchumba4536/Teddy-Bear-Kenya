"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useCatalogStore } from "@/store/catalogStore";
import { adminDeleteProduct } from "@/lib/actions/admin";
import { refreshCatalog } from "@/lib/refreshCatalog";
import { toastError, toastSuccess } from "@/store/toastStore";
import { formatKES } from "@/lib/format";

export default function AdminProductsPage() {
  const products = useCatalogStore((s) => s.products);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await adminDeleteProduct(id);
      await refreshCatalog();
      setConfirmDelete(null);
      toastSuccess("Product deleted");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink">Products</h1>
          <p className="text-ink-muted text-sm mt-1">{products.length} products in catalog</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary bg-caramel inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="input-field pl-10"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-ink-muted">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Size</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-blush/20">
                        <Image src={p.image} alt={p.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-ink">{p.name}</p>
                        <p className="text-xs text-ink-muted">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{p.size}</td>
                  <td className="p-4 font-semibold text-caramel">{formatKES(p.price)}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {p.featured && (
                        <span className="text-[10px] font-bold uppercase bg-caramel/10 text-caramel px-2 py-0.5 rounded-full">
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
                        className="p-2 rounded-lg hover:bg-caramel/10 text-caramel"
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
        {filtered.length === 0 && (
          <p className="text-center text-ink-muted py-12">No products found.</p>
        )}
      </div>
    </div>
  );
}
