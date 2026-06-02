"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Minus, Plus, Heart, ChevronDown, Smartphone, Truck, ShieldCheck } from "lucide-react";
import type { Product, BearColor, BearSize } from "@/types/product";
import { SIZE_PRICES, getRelatedProducts } from "@/lib/products";
import { getVariantOptions } from "@/lib/occasions";
import { getProductMarketMeta } from "@/lib/marketplace";
import { useProducts } from "@/hooks/useCatalog";
import { formatKES } from "@/lib/format";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductReviews from "@/components/product/ProductReviews";
import ShopProductCard from "@/components/marketplace/ShopProductCard";
import { useSiteSettings } from "@/hooks/useCatalog";

const COLOR_SWATCHES: Record<BearColor, string> = {
  Brown: "#8B5E3C",
  White: "#FFF8F0",
  Pink: "#F5C5C5",
  Grey: "#9E9E9E",
  Custom: "#7B68EE",
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [size, setSize] = useState<BearSize>(product.size);
  const [color, setColor] = useState<BearColor>(product.color);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [added, setAdded] = useState(false);
  const [openSection, setOpenSection] = useState<string>("description");

  const settings = useSiteSettings();
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));
  const allProducts = useProducts();
  const meta = getProductMarketMeta(product);

  const { sizes, colors } = useMemo(
    () => getVariantOptions(allProducts, product),
    [allProducts, product]
  );

  const price = Math.round((product.price / SIZE_PRICES[product.size]) * SIZE_PRICES[size]);
  const related = getRelatedProducts(allProducts, product.slug);
  const canReview = UUID_RE.test(product.id);

  const deliveryDetail = product.deliveryInfo || `Standard delivery across Kenya in 2–3 business days. Same-day delivery in Nairobi for orders before 12PM on eligible items. Free delivery on orders over ${formatKES(settings.freeDeliveryThreshold)}.`;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: `${product.name} (${size}, ${color})`,
      image: product.images[0] || product.image,
      size,
      color,
      quantity,
      price,
      personalMessage: message || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const sections = [
    {
      id: "description",
      title: "Product Description",
      content: (
        <div className="space-y-3 text-sm text-market-text leading-relaxed">
          <p>{product.description}</p>
          <p className="text-market-muted">{product.tagline}</p>
          <ul className="list-disc pl-5 space-y-1 text-market-muted">
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
      content: <p className="text-sm text-market-text leading-relaxed">{product.careInstructions}</p>,
    },
    {
      id: "delivery",
      title: "Delivery Information",
      content: (
        <div className="text-sm text-market-text space-y-3 leading-relaxed">
          <p>{deliveryDetail}</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Truck className="w-4 h-4 text-market-orange shrink-0 mt-0.5" />
              Standard fee from {formatKES(settings.standardDeliveryFee)} nationwide
            </li>
            <li className="flex items-start gap-2">
              <Smartphone className="w-4 h-4 text-market-orange shrink-0 mt-0.5" />
              Pay via M-Pesa Till {settings.mpesaTill}
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-market-orange shrink-0 mt-0.5" />
              Quality-checked before dispatch from Nairobi
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-market-gray min-h-screen">
      <div className="bg-white border-b border-market-border">
        <div className="container-main py-3 text-[12px] text-market-muted">
          <Link href="/" className="hover:text-market-orange">
            Home
          </Link>
          {" / "}
          <Link href="/shop" className="hover:text-market-orange">
            Teddy Bears
          </Link>
          {" / "}
          <span className="text-market-text">{product.name}</span>
        </div>
      </div>

      <div className="container-main py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductImageGallery
            images={product.images?.length ? product.images : [product.image]}
            alt={product.name}
            priority
          />

          <div className="bg-white rounded-lg border border-market-border p-5 md:p-6 shadow-market">
            {product.badge && (
              <span className="inline-block text-[11px] font-bold uppercase bg-market-orange text-white px-2 py-0.5 rounded mb-2">
                {product.badge}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-market-dark">{product.name}</h1>
            <p className="text-market-muted mt-1 text-sm">{product.tagline}</p>

            <div className="flex flex-wrap items-baseline gap-2 mt-4">
              <span className="text-2xl font-bold text-market-orange">{formatKES(price)}</span>
              <span className="text-sm text-market-muted line-through">
                {formatKES(meta.originalPrice)}
              </span>
              <span className="text-xs font-bold text-white bg-market-green px-1.5 py-0.5 rounded">
                -{meta.discountPercent}%
              </span>
            </div>

            {meta.showRating && (
              <p className="text-sm text-market-orange mt-2">
                ★ {meta.rating} ({meta.reviewCount} ratings)
              </p>
            )}

            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-market-muted mb-2">
                Size
              </p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 text-sm font-semibold rounded border transition-colors ${
                      size === s
                        ? "border-market-orange bg-market-orange text-white"
                        : "border-market-border hover:border-market-orange text-market-text"
                    }`}
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
              <p className="text-xs font-bold uppercase tracking-wider text-market-muted mb-2">
                Colour
              </p>
              <div className="flex flex-wrap gap-3">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    title={c}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      color === c ? "border-market-orange scale-110 ring-2 ring-market-orange/30" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: COLOR_SWATCHES[c] }}
                  />
                ))}
              </div>
              <p className="text-xs text-market-muted mt-2">Selected: {color}</p>
            </div>

            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-market-muted mb-2">
                Quantity
              </p>
              <div className="inline-flex items-center border border-market-border rounded">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-market-gray"
                  aria-label="Decrease"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-market-gray"
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
                className={`flex-1 py-3 font-bold text-sm rounded border-2 transition-colors ${
                  added
                    ? "bg-market-green border-market-green text-white"
                    : "border-market-orange text-market-orange hover:bg-market-orange hover:text-white"
                }`}
              >
                {added ? "✓ Added to Cart" : "Add to Cart"}
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-market-border rounded font-semibold text-sm hover:border-market-orange"
              >
                <Heart
                  className={`w-4 h-4 ${isWishlisted ? "fill-market-red text-market-red" : ""}`}
                />
                Wishlist
              </button>
            </div>

            <div className="mt-4">
              <label className="text-xs font-bold uppercase tracking-wider text-market-muted mb-2 block">
                Gift message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 100))}
                rows={2}
                className="market-input resize-none text-sm"
                placeholder="Printed on gift card…"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg border border-market-border p-5 md:p-6 shadow-market">
          {sections.map((sec) => (
            <div key={sec.id} className="border-b border-market-border last:border-0">
              <button
                type="button"
                onClick={() => setOpenSection(openSection === sec.id ? "" : sec.id)}
                className="w-full flex items-center justify-between py-4 text-left font-bold text-market-dark text-sm"
              >
                {sec.title}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openSection === sec.id ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openSection === sec.id && <div className="pb-4">{sec.content}</div>}
            </div>
          ))}
        </div>

        {canReview ? (
          <ProductReviews productId={product.id} slug={product.slug} />
        ) : (
          <p className="mt-8 text-sm text-market-muted bg-white border border-market-border rounded-lg p-4">
            Customer ratings appear for products saved in your live catalog. Seed products in
            Supabase to enable reviews.
          </p>
        )}
      </div>

      {related.length > 0 && (
        <section className="bg-white border-t border-market-border py-10">
          <div className="container-main">
            <h2 className="text-xl font-bold text-market-dark mb-6">You may also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
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
