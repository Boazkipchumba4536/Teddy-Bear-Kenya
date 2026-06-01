"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle } from "lucide-react";
import { checkoutSchema, type CheckoutSchema } from "@/lib/validators";
import { KENYA_COUNTIES, isNairobiCounty } from "@/lib/counties";
import { useCartStore } from "@/store/cartStore";
import { createOrder } from "@/lib/actions/orders";
import { formatKES } from "@/lib/format";
import { site } from "@/lib/site";
import MpesaButton from "./MpesaButton";

export default function CheckoutForm() {
  const [confirmed, setConfirmed] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { items, giftWrap, subtotal, deliveryFee, total, clearCart } = useCartStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryType: "standard",
      paymentMethod: "mpesa",
    },
  });

  const county = watch("county");
  const showSameDay = isNairobiCounty(county || "");

  const onSubmit = async (data: CheckoutSchema) => {
    setLoading(true);
    setError("");
    try {
      const order = await createOrder({
        items: [...items],
        shipping: {
          name: data.name,
          phone: data.phone,
          email: data.email,
          address: data.address,
          county: data.county,
          deliveryType: data.deliveryType,
          giftMessage: data.giftMessage,
        },
        paymentMethod: data.paymentMethod,
        subtotal: subtotal(),
        deliveryFee: deliveryFee(),
        giftWrap,
        total: total(),
      });
      setOrderId(order.id);
      setConfirmed(true);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !confirmed) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="font-display text-xl font-medium mb-2">Your cart is empty</h2>
        <p className="text-ink-muted mb-6">Add a bear before checking out.</p>
        <a href="/shop" className="btn-primary">
          Go to shop
        </a>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <CheckCircle className="w-16 h-16 text-mpesa mx-auto mb-4" />
        <h2 className="font-display text-2xl font-medium mb-2">Order confirmed!</h2>
        <p className="text-ink-muted mb-4">
          Your order <strong className="text-caramel">{orderId}</strong> has been received.
          We&apos;ve sent a confirmation to your phone.
        </p>
        <p className="text-sm text-ink-muted mb-6">
          Save your order number — you&apos;ll need it with your phone number to track delivery.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={`/track`} className="btn-primary">
            Track Order
          </a>
          <a href="/shop" className="btn-outline">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  const sub = subtotal();
  const delivery = deliveryFee();
  const tot = total();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8">
      {error && (
        <div className="lg:col-span-3 p-4 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>
      )}
      <div className="lg:col-span-2 space-y-8">
        {/* Contact */}
        <section className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-display text-xl font-medium mb-4">Contact Info</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Full Name</label>
              <input {...register("name")} className="input-field" placeholder="Jane Wanjiru" />
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Phone</label>
              <input {...register("phone")} className="input-field" placeholder="+254 712 345 678" />
              {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1 block">Email</label>
              <input {...register("email")} type="email" className="input-field" placeholder="jane@email.com" />
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
            </div>
          </div>
        </section>

        {/* Delivery */}
        <section className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-display text-xl font-medium mb-4">Delivery</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Address</label>
              <input {...register("address")} className="input-field" placeholder="Street, building, landmark" />
              {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">County</label>
              <select {...register("county")} className="input-field">
                <option value="">Select county</option>
                {KENYA_COUNTIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.county && <p className="text-red-600 text-xs mt-1">{errors.county.message}</p>}
              {showSameDay && (
                <span className="inline-block mt-2 text-xs font-medium bg-mpesa/10 text-mpesa px-3 py-1 rounded-full">
                  ✓ Same-day delivery available
                </span>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Delivery Type</label>
              <div className="flex flex-wrap gap-3">
                {showSameDay && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" {...register("deliveryType")} value="same-day" className="accent-caramel" />
                    <span className="text-sm">Same-day (Nairobi only)</span>
                  </label>
                )}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" {...register("deliveryType")} value="standard" className="accent-caramel" />
                  <span className="text-sm">Standard (2–3 days)</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Gift Message */}
        <section className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-display text-xl font-medium mb-4">Gift Message (optional)</h2>
          <textarea
            {...register("giftMessage")}
            rows={3}
            className="input-field resize-none"
            placeholder="Write a personal message for the gift card…"
          />
          {errors.giftMessage && (
            <p className="text-red-600 text-xs mt-1">{errors.giftMessage.message}</p>
          )}
        </section>

        {/* Payment */}
        <section className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-display text-xl font-medium mb-4">Payment</h2>
          <input type="hidden" {...register("paymentMethod")} value="mpesa" />
          <MpesaButton amount={tot} />
        </section>

        <button type="submit" disabled={loading} className="btn-mpesa w-full lg:hidden">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Placing Order…
            </>
          ) : (
            "Place Order"
          )}
        </button>
      </div>

      {/* Order Summary Sidebar */}
      <aside className="lg:sticky lg:top-24 h-fit">
        <div className="bg-white rounded-2xl p-6 shadow-card space-y-4">
          <h2 className="font-display text-xl font-medium">Order Summary</h2>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-ink-muted line-clamp-1 flex-1 mr-2">
                {item.name} × {item.quantity}
              </span>
              <span>{formatKES(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-caramel/10 pt-4 space-y-2 text-sm">
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
            <div className="flex justify-between font-semibold text-lg pt-2 border-t border-caramel/10">
              <span>Total</span>
              <span className="text-caramel">{formatKES(tot)}</span>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-mpesa w-full hidden lg:flex">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Placing Order…
              </>
            ) : (
              "Place Order"
            )}
          </button>
        </div>
      </aside>
    </form>
  );
}
