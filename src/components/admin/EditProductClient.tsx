"use client";

import { useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import type { Product } from "@/types/product";
import { adminUpdateProduct } from "@/lib/actions/admin";
import { patchProductInCatalog } from "@/lib/refreshCatalog";
import { toastError, toastSuccess } from "@/store/toastStore";

export default function EditProductClient({ product }: { product: Product }) {
  const router = useRouter();

  return (
    <ProductForm
      initial={product}
      submitLabel="Save Changes"
      onCancel={() => router.push("/admin/products")}
      onSubmit={(data) => {
        void (async () => {
          try {
            await adminUpdateProduct(product.id, data);
            patchProductInCatalog({ ...product, ...data });
            toastSuccess("Product updated");
            router.push("/admin/products");
          } catch (err) {
            toastError(err instanceof Error ? err.message : "Failed to update product");
          }
        })();
      }}
    />
  );
}
