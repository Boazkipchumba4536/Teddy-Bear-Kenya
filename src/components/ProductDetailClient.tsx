"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatKES } from "@/lib/format";
import { getProductPrice } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import { IMAGE_SIZES } from "@/lib/images";
import StickyBuyBar from "@/components/StickyBuyBar";
import type { Product as ProductType } from "@/lib/types";

interface Props {
  product: Product;
  related: ProductType[];
}

export default function ProductDetailClient({ product, related }: Props) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [variantId, setVariantId] = useState(product.variants?.[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  const price = getProductPrice(product, variantId);
  const wished = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart({
      productId: product.id,
      variantId,
      quantity,
      customization: customization.trim() || undefined,
    });
  };

  return (
    <div className="container-main py-10 md:py-14 pb-28 lg:pb-14">
      <nav className="text-sm text-ink-muted mb-10">
        <Link href="/" className="hover:text-ink transition">Home</Link>
        <span className="mx-2 opacity-40">/</span>
        <Link href="/shop" className="hover:text-ink transition">Shop</Link>
        <span className="mx-2 opacity-40">/</span>
        <span className="text-ink">{product.shortName}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
        <div>
          <div className="relative aspect-square rounded-4xl overflow-hidden bg-sand mb-4 shadow-soft">
            <ProductImage
              src={product.images[activeImage] ?? product.image}
              alt={product.name}
              priority
              sizes={IMAGE_SIZES.detail}
            />
            {!product.inStock && <span className="badge-sold text-sm px-5 py-2">Sold Out</span>}
            {product.salePrice && product.inStock && (
              <span className="badge-sale text-sm px-5 py-2">On Sale</span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden ring-2 transition-all ${
                    activeImage === i
                      ? "ring-wine shadow-soft scale-105"
                      : "ring-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <ProductImage src={img} alt="" sizes={IMAGE_SIZES.thumb} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:py-6 lg:pl-4">
          <h1 className="font-display text-3xl md:text-4xl font-medium text-ink leading-tight tracking-tight mb-5">
            {product.name}
          </h1>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex text-champagne">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-current" : "text-ink/15"}`}
                />
              ))}
            </div>
            <span className="text-sm text-ink-muted">{product.rating} rating</span>
          </div>

          <div className="mb-8 pb-8 border-b border-ink/10">
            {product.salePrice ? (
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-ink">{formatKES(product.salePrice)}</span>
                <span className="text-lg text-ink-light line-through">{formatKES(product.price)}</span>
              </div>
            ) : (
              <span className="text-3xl font-semibold text-ink">{formatKES(price)}</span>
            )}
          </div>

          <p className="text-ink-muted leading-relaxed mb-8">{product.description}</p>

          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <label className="block text-xs font-bold text-ink-muted mb-3 uppercase tracking-widest">
                Choose option
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVariantId(v.id)}
                    className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all ${
                      variantId === v.id
                        ? "border-ink bg-ink text-white"
                        : "border-ink/15 hover:border-ink/40"
                    }`}
                  >
                    {v.name} – {formatKES(v.price)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(product.customizable || product.category === "personalized") && (
            <div className="mb-6">
              <label htmlFor="custom-name" className="block text-sm font-bold mb-2">
                Custom name (optional)
              </label>
              <input
                id="custom-name"
                type="text"
                value={customization}
                onChange={(e) => setCustomization(e.target.value)}
                placeholder="Enter name for embroidery"
                className="input-field"
                maxLength={20}
              />
            </div>
          )}

          {product.inStock && (
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm font-bold">Quantity</span>
              <div className="flex items-center border border-ink/15 rounded-full overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-sand transition"
                  aria-label="Decrease"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-sand transition"
                  aria-label="Increase"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {product.inStock ? (
              <button type="button" onClick={handleAddToCart} className="btn-primary flex-1 sm:flex-none">
                <ShoppingBag className="w-4 h-4" />
                Add to cart
              </button>
            ) : (
              <Link href="/contact" className="btn-primary">
                Notify when available
              </Link>
            )}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`btn-secondary ${wished ? "!border-wine !text-wine" : ""}`}
            >
              <Heart className={`w-4 h-4 ${wished ? "fill-current" : ""}`} />
              Wishlist
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="bg-sand text-ink-muted px-4 py-2 rounded-full font-medium">
              🚚 Same-day Nairobi
            </span>
            <span className="bg-sand text-ink-muted px-4 py-2 rounded-full font-medium">
              💳 M-Pesa accepted
            </span>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="font-display text-2xl md:text-3xl font-medium text-ink mb-10">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <StickyBuyBar
        product={product}
        variantId={variantId}
        quantity={quantity}
      />
    </div>
  );
}
