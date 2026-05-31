"use client";

import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { IMAGE_SIZES } from "@/lib/images";
import { Minus, Plus, X } from "lucide-react";
import { products } from "@/data/products";
import { getProductPrice } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { formatKES } from "@/lib/format";

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    cartTotal,
    updateQuantity,
    removeFromCart,
  } = useStore();

  if (!cartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[60]"
        onClick={() => setCartOpen(false)}
        aria-hidden
      />
      <aside
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between p-4 border-b border-brand-100">
          <h2 className="font-display text-xl font-bold">Shopping cart</h2>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="p-2 rounded-full hover:bg-rose-50"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-cocoa/60">
              <p className="text-4xl mb-4">🛒</p>
              <p>No products in the cart.</p>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="btn-secondary mt-6"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              if (!product) return null;
              const linePrice = getProductPrice(product, item.variantId);
              const variant = product.variants?.find((v) => v.id === item.variantId);

              return (
                <div
                  key={`${item.productId}-${item.variantId}-${item.customization}`}
                  className="flex gap-3"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-ivory-dark">
                    <ProductImage
                      src={product.image}
                      alt={product.shortName}
                      sizes={IMAGE_SIZES.thumb}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm line-clamp-2">
                      {product.shortName}
                    </p>
                    {variant && (
                      <p className="text-xs text-cocoa/50">{variant.name}</p>
                    )}
                    {item.customization && (
                      <p className="text-xs text-cocoa/50">
                        Name: {item.customization}
                      </p>
                    )}
                    <p className="text-rose-600 font-bold text-sm mt-1">
                      {formatKES(linePrice)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.variantId,
                            item.quantity - 1
                          )
                        }
                        className="p-1 rounded border border-brand-200 hover:bg-rose-50"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.variantId,
                            item.quantity + 1
                          )
                        }
                        className="p-1 rounded border border-brand-200 hover:bg-rose-50"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(item.productId, item.variantId)
                        }
                        className="ml-auto text-xs text-cocoa/50 hover:text-rose-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-brand-100 p-4 space-y-3">
            <div className="flex justify-between font-bold text-lg">
              <span>Subtotal</span>
              <span className="text-rose-600">{formatKES(cartTotal)}</span>
            </div>
            <p className="text-xs text-cocoa/50">
              Delivery calculated at checkout. M-Pesa accepted.
            </p>
            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="btn-primary w-full text-center"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/cart"
              onClick={() => setCartOpen(false)}
              className="btn-secondary w-full text-center block"
            >
              View Cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
