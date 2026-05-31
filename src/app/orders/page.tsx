"use client";

import Link from "next/link";
import { products } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { formatKES } from "@/lib/format";

export default function OrdersPage() {
  const { orders, user } = useStore();

  if (!user && orders.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold mb-2">Orders</h1>
        <p className="text-cocoa/60 mb-6">Log in to see your order history.</p>
        <Link href="/login" className="btn-primary">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-cocoa/50">
          <p className="text-4xl mb-4">📦</p>
          <p>No orders yet.</p>
          <Link href="/shop" className="btn-primary mt-6 inline-flex">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-6">
              <div className="flex flex-wrap justify-between gap-2 mb-4">
                <div>
                  <p className="font-bold text-rose-600">{order.id}</p>
                  <p className="text-xs text-cocoa/50">
                    {new Date(order.createdAt).toLocaleString("en-KE")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatKES(order.total)}</p>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "confirmed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
              <ul className="text-sm text-cocoa/70 space-y-1 mb-3">
                {order.items.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  return (
                    <li key={`${item.productId}-${item.variantId}`}>
                      {product?.shortName ?? "Product"} × {item.quantity}
                    </li>
                  );
                })}
              </ul>
              <p className="text-xs text-cocoa/50">
                {order.paymentMethod.toUpperCase()} · Deliver to {order.shipping.city}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
