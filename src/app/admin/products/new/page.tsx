"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import { adminCreateProduct } from "@/lib/actions/admin";
import { refreshCatalog } from "@/lib/refreshCatalog";
import { toastError, toastSuccess } from "@/store/toastStore";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-caramel mb-6"
      >
        <ChevronLeft className="w-4 h-4" /> Back to products
      </Link>
      <h1 className="text-2xl font-display font-semibold text-ink mb-6">Add New Product</h1>
      <ProductForm
        submitLabel={saving ? "Creating…" : "Create Product"}
        onCancel={() => router.push("/admin/products")}
        onSubmit={async (data) => {
          setSaving(true);
          try {
            await adminCreateProduct(data);
            await refreshCatalog();
            toastSuccess("Product created");
            router.push("/admin/products");
          } catch (err) {
            toastError(err instanceof Error ? err.message : "Failed to create product");
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
