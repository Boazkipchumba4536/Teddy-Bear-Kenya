"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
import PageLoader from "@/components/PageLoader";
import EmptyState from "@/components/EmptyState";
import { useAuthStore } from "@/store/authStore";
import { fetchUserOrders } from "@/lib/actions/orders";
import { formatKES } from "@/lib/format";
import type { Order } from "@/types/order";

const STATUS_LABELS: Record<string, string> = {
  received: "Order Received",
  packed: "Packed",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

const STATUS_COLORS: Record<string, string> = {
  received: "bg-amber-100 text-amber-800",
  packed: "bg-blue-100 text-blue-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

export default function OrdersPage() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);
  const authLoaded = useAuthStore((s) => s.loaded);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!authLoaded) return;
    if (!user) {
      setLoading(false);
      return;
    }
    fetchUserOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [authLoaded, user]);

  if (!mounted || !authLoaded || loading) {
    return <PageLoader label="Loading orders…" />;
  }

  if (!user) {
    return (
      <EmptyState
        icon={Package}
        title="Sign in to view orders"
        description="Your order history is linked to your account for easy tracking and reorders."
        actionLabel="Sign in"
        actionHref="/login"
        secondaryLabel="Shop bears"
        secondaryHref="/shop"
      />
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        description="Your order history will appear here after your first purchase."
        actionLabel="Shop bears"
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="container-main py-10 max-w-3xl">
      <h1 className="font-display text-3xl font-medium mb-2">My Orders</h1>
      <p className="text-ink-muted mb-8">{orders.length} order(s)</p>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl p-6 shadow-card">
            <div className="flex flex-wrap justify-between gap-3 mb-4">
              <div>
                <p className="font-semibold text-caramel">{order.id}</p>
                <p className="text-xs text-ink-muted">
                  {new Date(order.createdAt).toLocaleString("en-KE", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">{formatKES(order.total)}</p>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                    STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-2 shrink-0 bg-cream rounded-xl p-2">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-medium line-clamp-1 max-w-[120px]">{item.name}</p>
                    <p className="text-xs text-ink-muted">×{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-caramel/10 text-sm text-ink-muted">
              <span>{order.paymentMethod.toUpperCase()}</span>
              <span>·</span>
              <span>{order.shipping.county}</span>
              <span>·</span>
              <Link href="/track" className="text-caramel font-medium hover:underline ml-auto">
                Track order
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
