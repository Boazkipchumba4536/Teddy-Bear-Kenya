"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, Store } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: Store },
  { href: "/shop", label: "Search", icon: Search, action: "search" as const },
  { href: "#cart", label: "Cart", icon: ShoppingBag, action: "cart" as const },
];

export default function MobileNavBar() {
  const pathname = usePathname();
  const { cartCount, setCartOpen } = useStore();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-ink/5 safe-bottom"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.action === undefined &&
            (pathname === item.href || (item.href === "/shop" && pathname.startsWith("/product")));

          if (item.action === "cart") {
            return (
              <button
                key="cart"
                type="button"
                onClick={() => setCartOpen(true)}
                className="flex flex-col items-center gap-0.5 text-ink-light hover:text-ink transition relative min-w-[4rem] py-1"
              >
                <Icon className="w-5 h-5" strokeWidth={1.75} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-3 bg-wine text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                )}
                <span className="text-[10px] font-semibold">{item.label}</span>
              </button>
            );
          }

          if (item.action === "search") {
            return (
              <Link
                key="search"
                href="/shop"
                className="flex flex-col items-center gap-0.5 text-ink-light hover:text-ink transition min-w-[4rem] py-1"
              >
                <Icon className="w-5 h-5" strokeWidth={1.75} />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 transition min-w-[4rem] py-1 ${
                isActive ? "text-wine" : "text-ink-light hover:text-ink"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} strokeWidth={1.75} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
