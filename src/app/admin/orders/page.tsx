"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAllOrders, updateOrderStatus, deleteOrder } from "@/lib/actions/orders";
import { toastError, toastSuccess } from "@/store/toastStore";
import { formatKES } from "@/lib/format";
import type { Order, OrderStatus } from "@/types/order";

const STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "received", label: "Order Received" },
  { value: "packed", label: "Packed" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      toastSuccess("Order status updated");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm(`Delete order ${orderId}?`)) return;
    try {
      await deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      toastSuccess("Order deleted");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to delete order");
    }
  };

  if (loading) {
    return <div className="text-ink-muted py-12">Loading orders…</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold text-ink">Orders</h1>
        <p className="text-ink-muted text-sm mt-1">{orders.length} total orders</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            filter === "all" ? "bg-caramel text-white" : "bg-white border border-gray-200"
          }`}
        >
          All
        </button>
        {STATUSES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === value ? "bg-caramel text-white" : "bg-white border border-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-ink-muted shadow-card">
            No orders in this category.
          </div>
        ) : (
          filtered.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex flex-wrap justify-between gap-4 mb-4">
                <div>
                  <Link
                    href={`/admin/orders/${encodeURIComponent(order.id)}`}
                    className="font-semibold text-caramel hover:underline"
                  >
                    {order.id}
                  </Link>
                  <p className="text-sm text-ink-muted mt-1">
                    {order.shipping.name} · {order.shipping.phone}
                  </p>
                  <p className="text-xs text-ink-light">
                    {new Date(order.createdAt).toLocaleString("en-KE")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold">{formatKES(order.total)}</p>
                  <p className="text-xs text-ink-muted capitalize">
                    {order.paymentMethod} · {order.shipping.county}
                  </p>
                </div>
              </div>

              <ul className="text-sm text-ink-muted mb-4 space-y-1">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.name} × {item.quantity} — {formatKES(item.price * item.quantity)}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
                <label className="text-sm font-medium">Status:</label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                  className="input-field w-auto py-2 text-sm"
                >
                  {STATUSES.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleDelete(order.id)}
                  className="ml-auto text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
