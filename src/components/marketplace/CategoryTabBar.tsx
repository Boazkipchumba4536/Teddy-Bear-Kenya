"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { SHOP_CATEGORY_TABS } from "@/lib/marketplace";

export default function CategoryTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentOccasion = searchParams.get("occasion") || "All";
  const [isPending, startTransition] = useTransition();

  if (pathname?.startsWith("/admin")) return null;

  const handleNav = (href: string) => (e: React.MouseEvent) => {
    if (
      href.startsWith("/shop") &&
      pathname.startsWith("/shop") &&
      !href.startsWith("/custom")
    ) {
      e.preventDefault();
      startTransition(() => router.push(href));
    }
  };

  return (
    <div
      className={`bg-ivory border-b border-caramel/10 overflow-x-hidden max-w-[100vw] transition-opacity duration-150 ${
        isPending ? "opacity-80" : ""
      }`}
    >
      <div className="container-main overflow-hidden">
        <nav
          className="flex gap-1 overflow-x-auto scrollbar-premium py-1"
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
                prefetch
                onClick={handleNav(tab.href)}
                className={isActive ? "shop-tab shop-tab-active" : "shop-tab shop-tab-idle"}
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
