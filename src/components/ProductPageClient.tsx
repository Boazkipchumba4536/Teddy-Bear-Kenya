"use client";

import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import FadeIn from "@/components/loading/FadeIn";
import type { Product } from "@/types/product";

export default function ProductPageClient({ product }: { product: Product }) {
  if (!product?.slug) {
    notFound();
  }

  return (
    <FadeIn>
      <ProductDetailClient product={product} />
    </FadeIn>
  );
}
