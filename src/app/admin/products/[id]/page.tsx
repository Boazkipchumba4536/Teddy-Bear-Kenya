import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { adminGetProduct } from "@/lib/actions/admin";
import EditProductClient from "@/components/admin/EditProductClient";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await adminGetProduct(params.id);

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
      <EditProductClient product={product} />
    </div>
  );
}
