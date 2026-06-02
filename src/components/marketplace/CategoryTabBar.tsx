"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { SHOP_CATEGORY_TABS } from "@/lib/marketplace";

export default function CategoryTabBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentOccasion = searchParams.get("occasion") || "All";

  if (pathname?.startsWith("/admin")) return null;

  return (
    <div className="bg-white border-b border-market-border overflow-hidden">
      <div className="container-main">
        <nav
          className="flex gap-1 overflow-x-auto scrollbar-hide py-0 -mx-4 px-4 sm:mx-0 sm:px-0"
          aria-label="Shop categories"
        >
          {SHOP_CATEGORY_TABS.map((tab) => {
            const isActive =
              tab.href === "/custom"
                ? pathname === "/custom"
                : tab.occasion
                  ? pathname.startsWith("/shop") && currentOccasion === tab.occasion
                  : pathname.startsWith("/shop") && !searchParams.get("occasion");

            return (
              <Link
                key={tab.label}
                href={tab.href}
                className={`shrink-0 px-4 py-3 text-[13px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-market-orange border-market-orange"
                    : "text-market-text border-transparent hover:text-market-orange"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
