"use client";

import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { IMAGE_SIZES } from "@/lib/images";
import { Minus, Plus, Trash2 } from "lucide-react";
import { products } from "@/data/products";
import { getProductPrice } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { formatKES } from "@/lib/format";

const DELIVERY_NAIROBI = 300;
const DELIVERY_OTHER = 500;

export default function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useStore();
  const delivery = DELIVERY_NAIROBI;
  const total = cartTotal + (cart.length > 0 ? delivery : 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h1 className="font-display text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-cocoa/60 mb-8">Add some cuddly gifts to get started!</p>
        <Link href="/shop" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="space-y-4 mb-8">
        {cart.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (!product) return null;
          const linePrice = getProductPrice(product, item.variantId);
          const variant = product.variants?.find((v) => v.id === item.variantId);

          return (
            <div key={`${item.productId}-${item.variantId}`} className="card p-4 flex gap-4">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-ivory-dark">
                <ProductImage src={product.image} alt={product.shortName} sizes={IMAGE_SIZES.thumb} />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/product/${product.slug}`}
                  className="font-semibold hover:text-rose-600 line-clamp-2"
                >
                  {product.name}
                </Link>
                {variant && <p className="text-sm text-cocoa/50">{variant.name}</p>}
                <p className="text-rose-600 font-bold mt-1">
                  {formatKES(linePrice * item.quantity)}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-brand-200 rounded-full">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.productId, item.variantId, item.quantity - 1)
                      }
                      className="p-2 hover:bg-rose-50 rounded-l-full"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.productId, item.variantId, item.quantity + 1)
                      }
                      className="p-2 hover:bg-rose-50 rounded-r-full"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId, item.variantId)}
                    className="text-cocoa/40 hover:text-red-500 p-2"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-6 space-y-3 max-w-md ml-auto">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatKES(cartTotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Delivery (Nairobi)</span>
          <span>{formatKES(delivery)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t border-brand-100 pt-3">
          <span>Total</span>
          <span className="text-rose-600">{formatKES(total)}</span>
        </div>
        <Link href="/checkout" className="btn-primary w-full text-center block mt-4">
          Proceed to Checkout
        </Link>
        <button
          type="button"
          onClick={clearCart}
          className="w-full text-sm text-cocoa/50 hover:text-rose-600 py-2"
        >
          Clear cart
        </button>
      </div>
    </div>
  );
}
