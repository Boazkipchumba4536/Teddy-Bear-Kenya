"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import OptimizedProductImage from "@/components/OptimizedProductImage";
import { X, Minus, Plus, Gift } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatKES } from "@/lib/format";
import { site } from "@/lib/site";

function useCartOpen() {
  return useCartStore((s) => s.isOpen);
}

function CartDrawerPanel() {
  const items = useCartStore((s) => s.items);
  const setOpen = useCartStore((s) => s.setOpen);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const giftWrap = useCartStore((s) => s.giftWrap);
  const toggleGiftWrap = useCartStore((s) => s.toggleGiftWrap);

  const sub = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const delivery = sub >= site.delivery.freeThreshold ? 0 : site.delivery.standardFee;
  const wrap = giftWrap ? site.delivery.giftWrapFee : 0;
  const tot = sub + delivery + wrap;

  return (
    <>
      <div
        className="fixed inset-0 bg-ink/40 z-[70] animate-[fadeIn_0.15s_ease-out]"
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[80] flex flex-col shadow-elevated animate-[slideInRight_0.2s_ease-out]"
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between p-4 border-b border-ink/5">
          <h2 className="text-xl font-bold">Your cart</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="p-2 rounded-lg hover:bg-surface-dark min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12 text-ink-muted">
              <p className="text-6xl mb-4">🧸</p>
              <p>Your cart is empty</p>
              <Link href="/shop" onClick={() => setOpen(false)} className="btn-primary mt-4 inline-flex">
                Start shopping
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-surface rounded-xl p-3 border border-ink/5">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                  <OptimizedProductImage
                    productId={item.productId}
                    src={item.image}
                    alt={item.name}
                    variant="thumb"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-ink-muted">
                    Size {item.size} · {item.color}
                  </p>
                  <p className="text-sm font-semibold text-accent mt-1">{formatKES(item.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg border border-ink/10 flex items-center justify-center"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg border border-ink/10 flex items-center justify-center"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-xs text-ink-light hover:text-accent"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-ink/5 p-4 space-y-4 bg-white">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={giftWrap}
                onChange={toggleGiftWrap}
                className="w-5 h-5 rounded accent-accent"
              />
              <Gift className="w-4 h-4 text-accent" />
              <span className="text-sm">Gift wrapping (+{formatKES(site.delivery.giftWrapFee)})</span>
            </label>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-muted">Subtotal</span>
                <span>{formatKES(sub)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Delivery</span>
                <span>{delivery === 0 ? "Free" : formatKES(delivery)}</span>
              </div>
              {giftWrap && (
                <div className="flex justify-between">
                  <span className="text-ink-muted">Gift wrap</span>
                  <span>{formatKES(site.delivery.giftWrapFee)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-ink/5">
                <span>Total</span>
                <span className="text-accent">{formatKES(tot)}</span>
              </div>
            </div>

            <Link href="/checkout" onClick={() => setOpen(false)} className="btn-mpesa w-full text-center">
              Proceed to checkout
            </Link>
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="block w-full text-center text-sm text-ink-muted hover:text-accent"
            >
              Continue shopping
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}

export default function CartDrawer() {
  const isOpen = useCartOpen();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted || !isOpen) return null;

  return <CartDrawerPanel />;
}
