"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { readCatalogCache, writeCatalogCache } from "@/lib/catalogCache";
import { useCatalogStore, defaultSiteSettings } from "@/store/catalogStore";
import { DEFAULT_PRODUCTS, DEFAULT_TESTIMONIALS } from "@/lib/products";
import type { CatalogBundle } from "@/types/catalog";
import { CatalogSeedContext } from "@/providers/catalogContext";

type Props = {
  children: React.ReactNode;
  /** Server-fetched catalog so the shop is not blocked on a slow client /api/catalog call. */
  initialCatalog?: CatalogBundle;
};

function applyBundle(bundle: CatalogBundle) {
  useCatalogStore.getState().hydrate(bundle);
  writeCatalogCache(bundle);
}

export default function CatalogProvider({ children, initialCatalog }: Props) {
  const hydrate = useCatalogStore((s) => s.hydrate);
  const loaded = useCatalogStore((s) => s.loaded);
  const setLoading = useCatalogStore((s) => s.setLoading);
  const seeded = useRef(false);

  useLayoutEffect(() => {
    if (seeded.current) return;
    if (initialCatalog?.products?.length) {
      seeded.current = true;
      queueMicrotask(() => applyBundle(initialCatalog));
      return;
    }
    const cached = readCatalogCache();
    if (cached?.products?.length) {
      seeded.current = true;
      queueMicrotask(() => hydrate(cached));
    }
  }, [initialCatalog, hydrate]);

  useEffect(() => {
    if (loaded || seeded.current) return;

    const cached = readCatalogCache();
    if (cached?.products?.length) {
      seeded.current = true;
      hydrate(cached);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/catalog", { signal: controller.signal });
        if (!res.ok) throw new Error("catalog fetch failed");
        const bundle = (await res.json()) as CatalogBundle;
        if (cancelled) return;
        if (bundle.products?.length) {
          seeded.current = true;
          applyBundle(bundle);
        } else {
          throw new Error("empty catalog");
        }
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;
        seeded.current = true;
        hydrate({
          products: DEFAULT_PRODUCTS,
          testimonials: DEFAULT_TESTIMONIALS,
          settings: defaultSiteSettings,
          productsFromDatabase: false,
          testimonialsFromDatabase: false,
        });
      } finally {
        if (!cancelled && !useCatalogStore.getState().loaded) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [hydrate, loaded, setLoading]);

  return (
    <CatalogSeedContext.Provider value={initialCatalog ?? null}>
      {children}
    </CatalogSeedContext.Provider>
  );
}
