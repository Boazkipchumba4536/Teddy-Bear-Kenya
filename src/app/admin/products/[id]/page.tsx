"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import { useCatalogStore } from "@/store/catalogStore";
import { adminUpdateProduct } from "@/lib/actions/admin";
import { refreshCatalog } from "@/lib/refreshCatalog";
import { toastError, toastSuccess } from "@/store/toastStore";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const product = useCatalogStore((s) => s.getProductById(id));
  const [saving, setSaving] = useState(false);

  if (!product) {
    return (
      <div className="text-center py-16">
        <p className="text-ink-muted mb-4">Product not found.</p>
        <Link href="/admin/products" className="btn-primary bg-caramel">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-caramel mb-6"
      >
        <ChevronLeft className="w-4 h-4" /> Back to products
      </Link>
      <h1 className="text-2xl font-display font-semibold text-ink mb-6">Edit Product</h1>
      <ProductForm
        initial={product}
        submitLabel={saving ? "Saving…" : "Save Changes"}
        onCancel={() => router.push("/admin/products")}
        onSubmit={async (data) => {
          setSaving(true);
          try {
            await adminUpdateProduct(id, data);
            await refreshCatalog();
            toastSuccess("Product updated");
            router.push("/admin/products");
          } catch (err) {
            toastError(err instanceof Error ? err.message : "Failed to update product");
          } finally {
            setSaving(false);
          }
        }}
      />
      {saving && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <Loader2 className="w-8 h-8 animate-spin text-caramel" />
        </div>
      )}
    </div>
  );
}
