"use client";

import { useLayoutEffect } from "react";
import type { Product } from "@/types/product";
import { useCatalogStore } from "@/store/catalogStore";

/** Loads full product list only on /admin/products routes (faster other admin pages). */
export default function AdminProductsCatalogSeed({
  products,
  children,
}: {
  products: Product[];
  children: React.ReactNode;
}) {
  useLayoutEffect(() => {
    const state = useCatalogStore.getState();
    useCatalogStore.setState({
      products,
      productsFromDatabase: products.length > 0,
      loaded: true,
      loading: false,
      testimonials: state.testimonials,
      settings: state.settings,
      testimonialsFromDatabase: state.testimonialsFromDatabase,
    });
  }, [products]);

  return <>{children}</>;
}
