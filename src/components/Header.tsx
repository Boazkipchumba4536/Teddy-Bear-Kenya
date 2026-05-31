"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { IMAGE_SIZES, LOGO_IMAGE } from "@/lib/images";
import { site } from "@/lib/site";

const nav = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const { cartCount, setCartOpen, wishlist, user } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
      setMenuOpen(false);
    }
  };

  const navClass =
    scrolled || !isHome || menuOpen || searchOpen ? "glass-nav-solid" : "bg-transparent border-transparent";

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${navClass}`}>
      <div className="container-main">
        <div className="flex items-center justify-between h-[72px] gap-6">
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <Image
              src={LOGO_IMAGE}
              alt={site.name}
              width={44}
              height={44}
              sizes={IMAGE_SIZES.logo}
              className="rounded-full object-cover ring-1 ring-ink/10 group-hover:ring-wine/30 transition"
              priority
            />
            <div className="hidden sm:block">
              <span className="font-display text-lg font-semibold text-ink leading-none tracking-tight">
                Teddy Bear
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-wine mt-0.5">
                Kenya
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Main">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors relative py-1 ${
                  pathname === item.href
                    ? "text-ink after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-wine"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-full hover:bg-ink/5 text-ink transition"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" strokeWidth={1.75} />
            </button>
            <Link
              href="/account"
              className="hidden sm:flex p-2.5 rounded-full hover:bg-ink/5 text-ink transition"
              aria-label="Account"
            >
              <User className="w-[18px] h-[18px]" strokeWidth={1.75} />
            </Link>
            <Link
              href="/shop?wishlist=1"
              className="relative p-2.5 rounded-full hover:bg-ink/5 text-ink transition"
              aria-label="Wishlist"
            >
              <Heart className="w-[18px] h-[18px]" strokeWidth={1.75} />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-wine text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-full hover:bg-ink/5 text-ink transition"
              aria-label="Cart"
            >
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-wine text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              type="button"
              className="lg:hidden p-2.5 rounded-full hover:bg-ink/5"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={onSearch} className="pb-5 animate-fade-in">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-light" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search teddy bears by size or name…"
                className="input-field pl-12 rounded-full text-center"
                autoFocus
              />
            </div>
          </form>
        )}
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-ink/5 bg-white px-5 py-6 space-y-1 animate-fade-in">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block py-3.5 px-4 rounded-2xl font-medium transition ${
                pathname === item.href ? "bg-sand text-ink" : "text-ink-muted hover:bg-sand"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={user ? "/account" : "/login"}
            className="block py-3.5 px-4 rounded-2xl font-medium text-ink-muted hover:bg-sand"
          >
            {user ? "My Account" : "Sign in"}
          </Link>
          <Link href="/shop" className="block mt-4 btn-primary text-center">
            Shop all bears
          </Link>
        </div>
      )}
    </header>
  );
}
