"use client";

import { useEffect } from "react";
import { fetchProducts, fetchSiteSettings, fetchTestimonials } from "@/lib/actions/catalog";
import { useCatalogStore } from "@/store/catalogStore";

export default function CatalogProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useCatalogStore((s) => s.hydrate);
  const setLoading = useCatalogStore((s) => s.setLoading);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [products, testimonials, settings] = await Promise.all([
          fetchProducts(),
          fetchTestimonials(),
          fetchSiteSettings(),
        ]);
        if (!cancelled) hydrate({ products, testimonials, settings });
      } catch {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [hydrate, setLoading]);

  return <>{children}</>;
}
