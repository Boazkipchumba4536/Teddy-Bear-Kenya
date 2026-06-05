"use client";

import { memo, useState, startTransition } from "react";
import Link from "next/link";
import OptimizedProductImage from "@/components/OptimizedProductImage";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/types/product";
import { formatKES } from "@/lib/format";
import { useCartStore } from "@/store/cartStore";
import { toastSuccess } from "@/store/toastStore";
import { useIsWishlisted, useWishlistStore } from "@/store/wishlistStore";

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: "home" | "shop";
}

function ProductCard({ product, index = 0, variant = "shop" }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useIsWishlisted(product.id);
  const isHome = variant === "home";
  const cardClass = isHome ? "product-card" : "shop-card h-full";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(() => {
      addItem(
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.image,
          size: product.size,
          color: product.color,
          quantity: 1,
          price: product.price,
        },
        { openDrawer: false }
      );
      setAdded(true);
    });
    toastSuccess("Added to cart");
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className={`group relative ${isHome ? "" : "h-full"}`}>
      <Link href={`/shop/${product.slug}`} className={`block ${cardClass}`}>
        <div className={isHome ? "product-card-media" : "shop-card-media"}>
          <OptimizedProductImage
            productId={product.id}
            slug={product.slug}
            src={product.image}
            alt={product.name}
            variant="card"
            priority={index < 4}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
          {product.badge && (
            <span className="absolute top-2.5 left-2.5 z-10 bg-accent text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
              {product.badge}
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-soft border border-ink/5"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-3.5 h-3.5 ${isWishlisted ? "fill-accent text-accent" : "text-ink-muted"}`}
            />
          </button>
        </div>

        <div className={`${isHome ? "p-3" : "p-4"} space-y-1`}>
          <h3 className="font-medium text-ink text-sm line-clamp-2 leading-snug group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="font-bold text-ink text-[15px]">{formatKES(product.price)}</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-ink-light">
              {product.size}
            </span>
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={handleAddToCart}
        className={`w-full mt-2 py-2.5 min-h-[40px] rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
          added
            ? "bg-mpesa text-white"
            : "bg-ink text-white hover:bg-accent md:opacity-0 md:group-hover:opacity-100"
        }`}
      >
        <ShoppingBag className="w-3.5 h-3.5" aria-hidden />
        {added ? "Added" : "Add to cart"}
      </button>
    </article>
  );
}

export default memo(ProductCard);
