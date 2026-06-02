"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Heart, ShoppingBag, User, Menu, X, HelpCircle } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import { site } from "@/lib/site";
import SearchModal from "./SearchModal";

const quickLinks = [
  { href: "/shop", label: "Teddy Bears" },
  { href: "/custom", label: "Custom" },
  { href: "/track", label: "Track Order" },
  { href: "/contact", label: "Help" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const itemCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const toggleCart = useCartStore((s) => s.toggleOpen);
  const user = useAuthStore((s) => s.user);
  const authLoaded = useAuthStore((s) => s.loaded);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) router.push(`/shop?q=${encodeURIComponent(q)}`);
    else router.push("/shop");
    setSearchQuery("");
  };

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-market-border shadow-market overflow-x-hidden">
        <div className="container-main max-w-[100vw]">
          <div className="flex items-center gap-2 md:gap-4 h-14 md:h-16 min-w-0">
            <Link href="/" className="flex items-center gap-1.5 shrink min-w-0 max-w-[42%] sm:max-w-none">
              <span className="text-xl sm:text-2xl shrink-0" aria-hidden>
                🧸
              </span>
              <span className="font-bold text-base sm:text-[20px] md:text-[22px] text-market-orange leading-none truncate">
                {site.name}
              </span>
            </Link>

            <form
              onSubmit={onSearchSubmit}
              className="hidden md:flex flex-1 max-w-2xl mx-2"
              role="search"
            >
              <div className="flex w-full rounded overflow-hidden border border-market-border focus-within:border-market-orange focus-within:ring-1 focus-within:ring-market-orange/30">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search teddy bears, occasions, gifts…"
                  className="flex-1 px-4 py-2.5 text-[13px] text-market-dark placeholder:text-market-muted focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-market-orange hover:bg-market-orange-dark text-white px-5 font-bold text-[13px] transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex items-center shrink-0 gap-0 sm:gap-0.5 md:gap-1 ml-auto">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="md:hidden p-2 w-10 h-10 flex items-center justify-center hover:bg-market-gray rounded shrink-0"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-market-dark" />
              </button>
              <Link
                href="/contact"
                className="hidden lg:flex p-2.5 items-center gap-1 text-[13px] font-medium text-market-text hover:text-market-orange"
              >
                <HelpCircle className="w-4 h-4" />
                Help
              </Link>
              <Link
                href={user ? "/account" : "/login"}
                className="flex items-center justify-center p-2 w-10 h-10 shrink-0 text-market-text hover:text-market-orange"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>
              <Link
                href="/wishlist"
                className="relative hidden sm:flex items-center justify-center p-2 w-10 h-10 shrink-0 text-market-text hover:text-market-orange"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-market-orange text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={toggleCart}
                className="relative flex items-center justify-center p-2 w-10 h-10 shrink-0 text-market-text hover:text-market-orange"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-market-orange text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 w-10 h-10 flex items-center justify-center shrink-0 hover:bg-market-gray rounded"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer — overflow-hidden on shell stops off-screen panel from widening the page */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden overflow-hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute top-0 right-0 h-full w-[min(300px,100vw)] max-w-full bg-white shadow-elevated transition-transform duration-300 ease-out overflow-y-auto overflow-x-hidden ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal={mobileOpen}
          aria-label="Navigation menu"
        >
          <div className="flex items-center justify-between p-4 border-b border-market-border">
            <span className="font-bold text-market-orange">{site.name}</span>
            <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={onSearchSubmit} className="p-4 border-b border-market-border">
            <div className="flex rounded overflow-hidden border border-market-border">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search teddy bears…"
                className="flex-1 px-3 py-2.5 text-sm"
              />
              <button type="submit" className="bg-market-orange text-white px-3 font-bold text-sm">
                Go
              </button>
            </div>
          </form>
          <nav className="flex flex-col p-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-lg text-[15px] font-medium ${
                  pathname === link.href
                    ? "bg-market-orange/10 text-market-orange"
                    : "text-market-text hover:bg-market-gray"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-lg text-[15px] font-medium text-market-text hover:bg-market-gray"
            >
              About
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-lg text-[15px] font-medium text-market-text hover:bg-market-gray sm:hidden"
            >
              Wishlist
              {wishlistCount > 0 ? ` (${wishlistCount})` : ""}
            </Link>
          </nav>
        </div>
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
