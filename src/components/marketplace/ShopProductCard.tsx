"use client";

import { memo, useState, startTransition } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import OptimizedProductImage from "@/components/OptimizedProductImage";
import type { Product } from "@/types/product";
import { formatKES } from "@/lib/format";
import { useCartStore } from "@/store/cartStore";
import { toastSuccess } from "@/store/toastStore";
import { useIsWishlisted, useWishlistStore } from "@/store/wishlistStore";

interface ShopProductCardProps {
  product: Product;
  priority?: boolean;
}

function displayBrand(product: Product) {
  if (product.brand) return product.brand;
  if (product.tagline.endsWith(" collection")) {
    return product.tagline.replace(/ collection.*$/i, "");
  }
  return "";
}

function ShopProductCard({ product, priority = false }: ShopProductCardProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useIsWishlisted(product.id);
  const brand = displayBrand(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    startTransition(() => {
      setAdded(true);
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
    });
    toastSuccess("Added to cart");
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="shop-card group">
      <Link href={`/shop/${product.slug}`} className="block flex-1 flex flex-col">
        <div className="shop-card-media">
          <OptimizedProductImage
            productId={product.id}
            slug={product.slug}
            src={product.image}
            alt={product.name}
            variant="card"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />

          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.badge && (
              <span className="bg-caramel text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                {product.badge}
              </span>
            )}
            {!product.inStock && (
              <span className="bg-ink/75 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                Out of stock
              </span>
            )}
            {brand && (
              <span className="bg-white/95 backdrop-blur-sm text-ink text-[10px] font-medium px-2.5 py-1 rounded-full border border-caramel/10">
                {brand}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm border border-caramel/10 flex items-center justify-center shadow-soft hover:scale-105 transition-transform"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isWishlisted ? "fill-terracotta text-terracotta" : "text-ink-muted"
              }`}
            />
          </button>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-medium text-ink text-sm leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-caramel transition-colors">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="font-display text-lg font-medium text-caramel">
              {formatKES(product.price)}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-light bg-blush/40 px-2 py-0.5 rounded-full">
              {product.size}
            </span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 mt-auto">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`shop-add-cart ${added ? "is-added" : ""}`}
        >
          {!product.inStock ? "Out of stock" : added ? "Added to cart" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}

export default memo(ShopProductCard);
