"use client";

import { useLayoutEffect } from "react";
import type { Product } from "@/types/product";
import { useCatalogStore } from "@/store/catalogStore";

export default function AdminCatalogProvider({
  products,
  children,
}: {
  products: Product[];
  children: React.ReactNode;
}) {
  useLayoutEffect(() => {
    const state = useCatalogStore.getState();
    state.hydrate({
      products,
      testimonials: state.testimonials,
      settings: state.settings,
      productsFromDatabase: true,
      testimonialsFromDatabase: state.testimonialsFromDatabase,
    });
  }, [products]);

  return <>{children}</>;
}
