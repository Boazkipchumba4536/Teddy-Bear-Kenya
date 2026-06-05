"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import { adminCreateProduct } from "@/lib/actions/admin";
import { appendProductToCatalog } from "@/lib/refreshCatalog";
import type { DbProduct } from "@/lib/supabase/types";
import { toastError, toastSuccess } from "@/store/toastStore";

export default function NewProductPage() {
  const router = useRouter();

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
        submitLabel="Create Product"
        onCancel={() => router.push("/admin/products")}
        onSubmit={(data) => {
          void (async () => {
            try {
              const created = await adminCreateProduct(data);
              if (created) appendProductToCatalog(created as DbProduct);
              toastSuccess("Product created");
              router.push("/admin/products");
            } catch (err) {
              toastError(err instanceof Error ? err.message : "Failed to create product");
            }
          })();
        }}
      />
    </div>
  );
}
