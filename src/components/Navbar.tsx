"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { selectCartItemCount, useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { site } from "@/lib/site";

const SearchModal = dynamic(() => import("./SearchModal"), { ssr: false });

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/custom", label: "Custom" },
  { href: "/shop?occasion=Valentine's", label: "Gifts" },
  { href: "/track", label: "Track" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore(selectCartItemCount);
  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const toggleCart = useCartStore((s) => s.toggleOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/shop") return pathname === "/shop" && !pathname.includes("?");
    if (href.startsWith("/shop?")) return pathname.startsWith("/shop");
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const onHero = isHome && !scrolled;

  return (
    <>
      <header
        className={`fixed top-8 left-0 right-0 z-50 transition-all duration-300 ${
          onHero
            ? "bg-transparent border-b border-transparent"
            : "bg-white/95 backdrop-blur-xl border-b border-ink/5 shadow-soft"
        }`}
      >
        <div className="container-main">
          <div className="flex items-center justify-between h-14 md:h-16 gap-4">
            <Link href="/" className="shrink-0" aria-label={`${site.name} home`}>
              <span
                className={`text-lg md:text-xl font-bold tracking-tight ${
                  onHero ? "text-white" : "text-ink"
                }`}
              >
                {site.name}
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                    isActive(link.href)
                      ? onHero
                        ? "bg-white/15 text-white"
                        : "bg-accent/10 text-accent"
                      : onHero
                        ? "text-white/80 hover:text-white hover:bg-white/10"
                        : "text-ink-muted hover:text-ink hover:bg-surface-dark"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-0.5">
              {[
                { icon: Search, label: "Search", onClick: () => setSearchOpen(true) },
              ].map(({ icon: Icon, label, onClick }) => (
                <button
                  key={label}
                  type="button"
                  onClick={onClick}
                  className={`p-2.5 rounded-lg transition-colors ${
                    onHero
                      ? "text-white/90 hover:bg-white/10"
                      : "text-ink-muted hover:text-accent hover:bg-surface-dark"
                  }`}
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </button>
              ))}
              <Link
                href="/wishlist"
                className={`relative hidden sm:flex p-2.5 rounded-lg transition-colors ${
                  onHero
                    ? "text-white/90 hover:bg-white/10"
                    : "text-ink-muted hover:text-accent hover:bg-surface-dark"
                }`}
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" strokeWidth={1.75} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={toggleCart}
                className={`relative p-2.5 rounded-lg transition-colors ${
                  onHero
                    ? "text-white/90 hover:bg-white/10"
                    : "text-ink-muted hover:text-accent hover:bg-surface-dark"
                }`}
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.75} />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-ink text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>
              <Link
                href="/shop"
                className={`hidden md:inline-flex ml-1 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  onHero
                    ? "bg-white text-ink hover:bg-white/90"
                    : "bg-accent text-white hover:bg-accent-dark"
                }`}
              >
                Shop now
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className={`lg:hidden p-2.5 rounded-lg ${
                  onHero ? "text-white hover:bg-white/10" : "hover:bg-surface-dark"
                }`}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer so content clears fixed nav (except hero which is full-bleed) */}
      {!isHome && <div className="h-[4.5rem] md:h-20 shrink-0" aria-hidden />}

      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-[min(300px,100vw)] bg-white shadow-elevated transition-transform duration-300 ease-out overflow-y-auto ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal={mobileOpen}
          aria-label="Menu"
        >
          <div className="flex items-center justify-between p-5 border-b border-ink/5">
            <span className="text-lg font-bold text-ink">{site.name}</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg hover:bg-surface-dark"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex flex-col p-3 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3.5 rounded-lg text-[15px] font-semibold transition-colors ${
                  isActive(link.href)
                    ? "bg-accent/10 text-accent"
                    : "text-ink-muted hover:bg-surface-dark"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/wishlist"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3.5 rounded-lg text-[15px] font-semibold text-ink-muted hover:bg-surface-dark sm:hidden"
            >
              Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
            </Link>
          </nav>
          <div className="p-4">
            <Link
              href="/shop"
              onClick={() => setMobileOpen(false)}
              className="btn-primary w-full text-center"
            >
              Shop all bears
            </Link>
          </div>
        </div>
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
