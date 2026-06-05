"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Minus, Plus, Heart, ChevronDown, Smartphone, Truck, ShieldCheck } from "lucide-react";
import type { Product, BearColor, BearSize } from "@/types/product";
import { SIZE_PRICES, getRelatedProducts } from "@/lib/products";
import { bearColorSwatchStyle, normalizeBearColor } from "@/lib/bearColors";
import { getVariantOptions } from "@/lib/occasions";
import { useProducts } from "@/hooks/useCatalog";
import { formatKES } from "@/lib/format";
import { useCartStore } from "@/store/cartStore";
import { useIsWishlisted, useWishlistStore } from "@/store/wishlistStore";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ShopProductCard from "@/components/marketplace/ShopProductCard";
import { useSiteSettings } from "@/hooks/useCatalog";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [size, setSize] = useState<BearSize>(product.size);
  const [color, setColor] = useState<BearColor>(normalizeBearColor(product.color));
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [added, setAdded] = useState(false);
  const [openSection, setOpenSection] = useState<string>("description");

  const settings = useSiteSettings();
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useIsWishlisted(product.id);
  const allProducts = useProducts();
  const { sizes, colors } = useMemo(
    () => getVariantOptions(allProducts, product),
    [allProducts, product]
  );

  const price = Math.round((product.price / SIZE_PRICES[product.size]) * SIZE_PRICES[size]);
  const related = getRelatedProducts(allProducts, product.slug);
  const deliveryDetail = product.deliveryInfo || `Standard delivery across Kenya in 2–3 business days. Same-day delivery in Nairobi for orders before 12PM on eligible items. Free delivery on orders over ${formatKES(settings.freeDeliveryThreshold)}.`;

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: `${product.name} (${size}, ${color})`,
        image: product.images[0] || product.image,
        size,
        color,
        quantity,
        price,
        personalMessage: message || undefined,
      },
      { openDrawer: true }
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const sections = [
    {
      id: "description",
      title: "Product Description",
      content: (
        <div className="space-y-3 text-sm text-ink-muted leading-relaxed">
          <p>{product.description}</p>
          <p className="text-ink-light">{product.tagline}</p>
          <ul className="list-disc pl-5 space-y-1 text-ink-light">
            <li>Size selected: {size} (height varies by style)</li>
            <li>Colour: {color}</li>
            <li>Ideal for: {product.occasions.join(", ")}</li>
          </ul>
        </div>
      ),
    },
    {
      id: "care",
      title: "Care Instructions",
      content: <p className="text-sm text-ink-muted leading-relaxed">{product.careInstructions}</p>,
    },
    {
      id: "delivery",
      title: "Delivery Information",
      content: (
        <div className="text-sm text-ink-muted space-y-3 leading-relaxed">
          <p>{deliveryDetail}</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Truck className="w-4 h-4 text-caramel shrink-0 mt-0.5" />
              Standard fee from {formatKES(settings.standardDeliveryFee)} nationwide
            </li>
            <li className="flex items-start gap-2">
              <Smartphone className="w-4 h-4 text-caramel shrink-0 mt-0.5" />
              Pay via M-Pesa Till {settings.mpesaTill}
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-caramel shrink-0 mt-0.5" />
              Quality-checked before dispatch from Nairobi
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="shop-page">
      <div className="shop-page-header">
        <div className="container-main py-4 shop-breadcrumb">
          <Link href="/">Home</Link>
          {" / "}
          <Link href="/shop">Shop</Link>
          {" / "}
          <span className="text-ink-muted line-clamp-1">{product.name}</span>
        </div>
      </div>

      <div className="container-main py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductImageGallery
            productId={product.id}
            slug={product.slug}
            images={[product.image]}
            alt={product.name}
            priority
          />

          <div className="shop-panel p-6 md:p-8">
            {product.badge && (
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-caramel text-white px-3 py-1 rounded-full mb-3">
                {product.badge}
              </span>
            )}
            {!product.inStock && (
              <span className="inline-block text-xs font-semibold bg-ink/10 text-ink px-3 py-1 rounded-full mb-3 ml-2">
                Out of stock
              </span>
            )}
            <h1 className="font-display text-2xl md:text-4xl font-medium text-ink">{product.name}</h1>
            <p className="text-ink-muted mt-2 text-sm">{product.tagline}</p>

            <p className="font-display text-3xl font-medium text-caramel mt-5">{formatKES(price)}</p>

            <div className="mt-6">
              <p className="shop-label mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={size === s ? "shop-option shop-option-active" : "shop-option"}
                  >
                    {s}
                    <span className="block text-[10px] font-normal opacity-80">
                      {formatKES(
                        Math.round((product.price / SIZE_PRICES[product.size]) * SIZE_PRICES[s])
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <p className="shop-label mb-3">Colour</p>
              <div className="flex flex-wrap gap-3">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    title={c}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      color === c ? "border-caramel scale-110 ring-2 ring-caramel/30" : "border-ink/15"
                    }`}
                    style={bearColorSwatchStyle(c)}
                  />
                ))}
              </div>
              <p className="text-xs text-ink-light mt-2">Selected: {color}</p>
            </div>

            <div className="mt-5">
              <p className="shop-label mb-3">Quantity</p>
              <div className="shop-qty">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="shop-qty-btn"
                  aria-label="Decrease"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold tabular-nums">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="shop-qty-btn"
                  aria-label="Increase"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`shop-add-cart flex-1 ${added ? "is-added" : ""}`}
              >
                {added ? "Added to cart" : product.inStock ? "Add to cart" : "Out of stock"}
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className="flex items-center justify-center gap-2 px-6 py-3 btn-outline min-h-0 rounded-xl"
              >
                <Heart
                  className={`w-4 h-4 ${isWishlisted ? "fill-terracotta text-terracotta" : "text-ink-muted"}`}
                />
                Wishlist
              </button>
            </div>

            <div className="mt-4">
              <label className="shop-label mb-2 block">Gift message (optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 100))}
                rows={2}
                className="input-field resize-none text-sm"
                placeholder="Printed on gift card…"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 shop-panel p-6 md:p-8">
          {sections.map((sec) => (
            <div key={sec.id} className="border-b border-caramel/10 last:border-0">
              <button
                type="button"
                onClick={() => setOpenSection(openSection === sec.id ? "" : sec.id)}
                className="shop-accordion-btn text-sm"
              >
                {sec.title}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openSection === sec.id ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSection === sec.id && <div className="shop-accordion-panel">{sec.content}</div>}
            </div>
          ))}
        </div>

      </div>

      {related.length > 0 && (
        <section className="border-t border-caramel/10 py-12 md:py-16 bg-cream/30">
          <div className="container-main">
            <h2 className="font-display text-2xl font-medium text-ink mb-8">You may also like</h2>
            <div className="shop-grid md:grid-cols-4">
              {related.map((p) => (
                <ShopProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
