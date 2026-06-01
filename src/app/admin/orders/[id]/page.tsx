"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { fetchAllOrders, updateOrderStatus } from "@/lib/actions/orders";
import { toastError, toastSuccess } from "@/store/toastStore";
import { formatKES } from "@/lib/format";
import type { Order, OrderStatus } from "@/types/order";

const STATUSES: OrderStatus[] = ["received", "packed", "out_for_delivery", "delivered"];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = decodeURIComponent(params.id as string);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllOrders()
      .then((orders) => setOrder(orders.find((o) => o.id === orderId) ?? null))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleStatusChange = async (status: OrderStatus) => {
    if (!order) return;
    try {
      await updateOrderStatus(order.id, status);
      setOrder({ ...order, status });
      toastSuccess("Order status updated");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  if (loading) {
    return <div className="text-ink-muted py-12">Loading order…</div>;
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-ink-muted mb-4">Order not found.</p>
        <Link href="/admin/orders" className="btn-primary bg-caramel">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-caramel mb-6"
      >
        <ChevronLeft className="w-4 h-4" /> Back to orders
      </Link>

      <div className="flex flex-wrap justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink">{order.id}</h1>
          <p className="text-ink-muted text-sm mt-1">
            Placed {new Date(order.createdAt).toLocaleString("en-KE")}
          </p>
        </div>
        <select
          value={order.status}
          onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
          className="input-field w-auto"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-card space-y-4">
          <h2 className="font-semibold">Customer</h2>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Name</dt>
              <dd>{order.shipping.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Phone</dt>
              <dd>{order.shipping.phone}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Email</dt>
              <dd>{order.shipping.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Address</dt>
              <dd className="text-right max-w-[200px]">{order.shipping.address}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">County</dt>
              <dd>{order.shipping.county}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Delivery</dt>
              <dd className="capitalize">{order.shipping.deliveryType.replace("-", " ")}</dd>
            </div>
          </dl>
          {order.shipping.giftMessage && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm font-medium mb-1">Gift Message</p>
              <p className="text-sm text-ink-muted italic">&ldquo;{order.shipping.giftMessage}&rdquo;</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-semibold mb-4">Order Summary</h2>
          <ul className="space-y-3 mb-4">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatKES(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-muted">Subtotal</span>
              <span>{formatKES(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Delivery</span>
              <span>{formatKES(order.deliveryFee)}</span>
            </div>
            {order.giftWrap && (
              <div className="flex justify-between">
                <span className="text-ink-muted">Gift wrap</span>
                <span>Included</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg pt-2">
              <span>Total</span>
              <span className="text-caramel">{formatKES(order.total)}</span>
            </div>
            <p className="text-xs text-ink-muted pt-2">
              Payment: {order.paymentMethod.toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
