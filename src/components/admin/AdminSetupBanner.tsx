"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, X } from "lucide-react";
import { useCatalogStore } from "@/store/catalogStore";

export default function AdminSetupBanner() {
  const products = useCatalogStore((s) => s.products);
  const loaded = useCatalogStore((s) => s.loaded);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const key = "bearhug-admin-setup-dismissed";
    setDismissed(sessionStorage.getItem(key) === "1");
  }, []);

  if (!loaded || dismissed || products.length > 0) return null;

  return (
    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 flex gap-3">
      <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
      <div className="flex-1 text-sm">
        <p className="font-semibold text-amber-900">Catalog not seeded yet</p>
        <p className="text-amber-800 mt-1">
          Your store has no products in the database. Go to{" "}
          <Link href="/admin/settings" className="underline font-medium">
            Settings
          </Link>{" "}
          and click <strong>Seed Catalog to Supabase</strong>, or add your first product manually.
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          sessionStorage.setItem("bearhug-admin-setup-dismissed", "1");
          setDismissed(true);
        }}
        className="p-1 rounded-lg hover:bg-amber-100 shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4 text-amber-700" />
      </button>
    </div>
  );
}
