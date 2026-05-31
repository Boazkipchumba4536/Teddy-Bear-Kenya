"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatKES } from "@/lib/format";
import type { Address } from "@/lib/types";

const DELIVERY = 300;

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, placeOrder, user } = useStore();
  const [payment, setPayment] = useState<"mpesa" | "card" | "cod">("mpesa");
  const [done, setDone] = useState<string | null>(null);
  const [form, setForm] = useState<Address>({
    label: "Home",
    street: "",
    city: "Nairobi",
    county: "Nairobi",
    phone: user?.phone ?? "",
  });

  const total = cartTotal + (cart.length > 0 ? DELIVERY : 0);

  if (cart.length === 0 && !done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-cocoa/60 mb-6">Your cart is empty.</p>
        <Link href="/shop" className="btn-primary">
          Shop now
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">✅</p>
        <h1 className="font-display text-2xl font-bold mb-2">Order placed!</h1>
        <p className="text-cocoa/60 mb-2">Order ID: <strong>{done}</strong></p>
        {payment === "mpesa" && (
          <p className="text-sm text-cocoa/60 mb-6">
            You will receive an M-Pesa STK push shortly. Pay{" "}
            <strong>{formatKES(total)}</strong> to complete your order.
          </p>
        )}
        <Link href="/orders" className="btn-primary">
          View orders
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const order = placeOrder(form, payment);
    if (order) {
      setDone(order.id);
      setTimeout(() => router.push("/orders"), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-semibold text-lg mb-4">Delivery details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full name</label>
                <input
                  required
                  className="input-field"
                  placeholder="Jane Wanjiku"
                  defaultValue={user?.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone (M-Pesa)</label>
                <input
                  required
                  type="tel"
                  className="input-field"
                  placeholder="07XX XXX XXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Street / Estate</label>
                <input
                  required
                  className="input-field"
                  placeholder="e.g. Westlands, Ring Road"
                  value={form.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    required
                    className="input-field"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">County</label>
                  <input
                    required
                    className="input-field"
                    value={form.county}
                    onChange={(e) => setForm({ ...form, county: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-lg mb-4">Payment method</h2>
            <div className="space-y-3">
              {(
                [
                  ["mpesa", "M-Pesa (STK Push)", "Pay instantly via Safaricom"],
                  ["card", "Debit / Credit Card", "Visa, Mastercard accepted"],
                  ["cod", "Cash on Delivery", "Pay when you receive (Nairobi only)"],
                ] as const
              ).map(([id, label, desc]) => (
                <label
                  key={id}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                    payment === id
                      ? "border-rose-600 bg-rose-50"
                      : "border-brand-100 hover:border-brand-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={id}
                    checked={payment === id}
                    onChange={() => setPayment(id)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold">{label}</p>
                    <p className="text-xs text-cocoa/50">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="font-semibold text-lg mb-4">Order summary</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} items)</span>
                <span>{formatKES(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{formatKES(DELIVERY)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-brand-100 pt-3">
                <span>Total (KES)</span>
                <span className="text-rose-600">{formatKES(total)}</span>
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">
              Place order – {formatKES(total)}
            </button>
            <p className="text-xs text-cocoa/40 mt-4 text-center">
              By placing your order you agree to our terms. Pickup available at
              Yala Towers, 4th Floor.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
