"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import { site } from "@/lib/site";
import SearchModal from "./SearchModal";
import StaffNavLink from "./StaffNavLink";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?occasion=Valentine's", label: "Occasions" },
  { href: "/custom", label: "Custom Bears" },
  { href: "/about", label: "About" },
  { href: "/track", label: "Track Order" },
  { href: "/account", label: "Account" },
];

function BearLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="22" r="12" fill="#8B5E3C" />
      <circle cx="11" cy="12" r="6" fill="#8B5E3C" />
      <circle cx="29" cy="12" r="6" fill="#8B5E3C" />
      <circle cx="15" cy="20" r="2" fill="#FFF8F0" />
      <circle cx="25" cy="20" r="2" fill="#FFF8F0" />
      <ellipse cx="20" cy="26" rx="3" ry="2" fill="#F5C5C5" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const toggleCart = useCartStore((s) => s.toggleOpen);
  const user = useAuthStore((s) => s.user);
  const authLoaded = useAuthStore((s) => s.loaded);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-nav shadow-sm" : "bg-cream"
        }`}
      >
        <div className="container-main flex items-center justify-between h-16 md:h-18">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <BearLogo />
            <span className="font-display text-lg md:text-xl font-semibold text-ink">
              {site.name}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink-muted hover:text-caramel transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-caramel/10 transition-colors"
            >
              <Search className="w-5 h-5 text-ink" />
            </button>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-caramel/10 transition-colors"
            >
              <Heart className="w-5 h-5 text-ink" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blush-dark text-ink text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/account"
              aria-label="My Account"
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-caramel/10 transition-colors"
            >
              <User className="w-5 h-5 text-ink" />
            </Link>
            <StaffNavLink className="hidden sm:flex" />
            <button
              type="button"
              onClick={toggleCart}
              aria-label="Open cart"
              className="relative p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-caramel/10 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-ink" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-caramel text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="lg:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-caramel/10"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-[min(320px,85vw)] bg-cream shadow-elevated transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-caramel/10">
            <span className="font-display font-semibold">{site.name}</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="p-2 rounded-full hover:bg-caramel/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 min-h-[44px] rounded-xl text-base font-medium hover:bg-blush/30 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {authLoaded && !user && (
              <Link
                href="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 min-h-[44px] rounded-xl text-base font-medium text-ink/60 hover:bg-blush/30 transition-colors"
              >
                Staff
              </Link>
            )}
          </nav>
        </div>
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
