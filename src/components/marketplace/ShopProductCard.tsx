"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Zap, BadgeCheck } from "lucide-react";
import type { Product } from "@/types/product";
import { formatKES } from "@/lib/format";
import { getProductMarketMeta } from "@/lib/marketplace";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

interface ShopProductCardProps {
  product: Product;
}

export default function ShopProductCard({ product }: ShopProductCardProps) {
  const [added, setAdded] = useState(false);
  const meta = getProductMarketMeta(product);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      size: product.size,
      color: product.color,
      quantity: 1,
      price: product.price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="market-card group flex flex-col h-full bg-white rounded border border-market-border shadow-market hover:-translate-y-0.5 hover:shadow-market-hover transition-all duration-200">
      <Link href={`/shop/${product.slug}`} className="block flex-1 flex flex-col">
        <div className="relative aspect-square bg-white p-3 overflow-hidden group/image">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            quality={80}
            className="object-contain p-2 transition-transform duration-500 ease-out group-hover/image:scale-125"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes("fallback")) target.src = "/images/fallback.svg";
            }}
          />

          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {meta.officialStore && (
              <span className="flex items-center gap-0.5 bg-[#0066cc] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm w-fit">
                <BadgeCheck className="w-3 h-3" />
                Official
              </span>
            )}
            {meta.express && (
              <span className="flex items-center gap-0.5 bg-market-orange/10 text-market-orange text-[10px] font-bold px-1.5 py-0.5 rounded-sm border border-market-orange/30 w-fit">
                <Zap className="w-3 h-3 fill-current" />
                Express
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
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white border border-market-border flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isWishlisted ? "fill-market-red text-market-red" : "text-market-muted"
              }`}
            />
          </button>
        </div>

        <div className="px-3 pb-2 flex-1 flex flex-col">
          <h3 className="text-[13px] text-market-text leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-market-orange transition-colors">
            {product.name}
          </h3>

          <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-base font-bold text-market-orange">{formatKES(product.price)}</span>
            <span className="text-[13px] text-market-muted line-through">
              {formatKES(meta.originalPrice)}
            </span>
            <span className="text-[11px] font-bold text-white bg-market-green px-1.5 py-0.5 rounded-sm">
              -{meta.discountPercent}%
            </span>
          </div>

          {meta.showRating && (
            <div className="mt-1.5 flex items-center gap-1 text-[12px]">
              <span className="text-market-orange tracking-tight" aria-hidden>
                {"★".repeat(Math.floor(meta.rating))}
                {meta.rating % 1 >= 0.5 ? "½" : ""}
              </span>
              <span className="text-market-muted">({meta.reviewCount})</span>
            </div>
          )}
        </div>
      </Link>

      <div className="px-3 pb-3 mt-auto">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`market-add-cart w-full ${added ? "is-added" : ""}`}
        >
          {added ? "✓ Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}
