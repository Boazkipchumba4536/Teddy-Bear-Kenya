"use client";

import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatKES } from "@/lib/format";
import { getProductPrice } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import ProductImage from "@/components/ProductImage";
import { IMAGE_SIZES } from "@/lib/images";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const price = getProductPrice(product);
  const wished = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart({
      productId: product.id,
      variantId: product.variants?.[0]?.id,
      quantity: 1,
    });
  };

  const priceDisplay = product.salePrice ? (
    <>
      <span className="text-ink font-semibold">{formatKES(product.salePrice)}</span>
      <span className="text-ink-light text-sm line-through ml-1.5">{formatKES(product.price)}</span>
    </>
  ) : product.variants && product.variants.length > 1 ? (
    <span className="text-ink font-semibold text-sm">
      {formatKES(Math.min(...product.variants.map((v) => v.price)))}
      {" – "}
      {formatKES(Math.max(...product.variants.map((v) => v.price)))}
    </span>
  ) : (
    <span className="text-ink font-semibold">{formatKES(price)}</span>
  );

  return (
    <article className="group">
      <Link href={`/product/${product.slug}`} className="block relative aspect-[3/4] rounded-3xl overflow-hidden bg-sand mb-4">
        <ProductImage
          src={product.image}
          alt={product.shortName}
          sizes={IMAGE_SIZES.card}
          className="image-zoom"
        />

        {!product.inStock && <span className="badge-sold">Sold out</span>}
        {product.salePrice && product.inStock && <span className="badge-sale">Sale</span>}
        {product.exclusive && product.inStock && !product.salePrice && (
          <span className="badge-new">New</span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
            wished
              ? "bg-wine text-white"
              : "bg-white/90 text-ink/40 opacity-0 group-hover:opacity-100 hover:text-wine backdrop-blur-sm"
          } ${wished ? "opacity-100" : ""}`}
          aria-label="Add to wishlist"
        >
          <Heart className={`w-4 h-4 ${wished ? "fill-current" : ""}`} strokeWidth={1.75} />
        </button>

        {product.inStock && (!product.variants || product.variants.length <= 1) && (
          <button
            type="button"
            onClick={handleQuickAdd}
            className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-ink text-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-wine shadow-elevated"
            aria-label="Quick add to cart"
          >
            <Plus className="w-5 h-5" strokeWidth={2} />
          </button>
        )}
      </Link>

      <div className="space-y-1.5">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium text-ink text-sm leading-snug line-clamp-2 group-hover:text-wine transition-colors">
            {product.shortName}
          </h3>
        </Link>
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm">{priceDisplay}</div>
          {product.inStock && product.variants && product.variants.length > 1 && (
            <Link
              href={`/product/${product.slug}`}
              className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted hover:text-wine transition"
            >
              Options
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
