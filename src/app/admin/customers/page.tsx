"use client";

import { useEffect, useState } from "react";
import { fetchAllCustomers, fetchAllOrders } from "@/lib/actions/orders";
import type { User, Order } from "@/types/order";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchAllCustomers().then(setCustomers).catch(() => setCustomers([]));
    fetchAllOrders().then(setOrders).catch(() => setOrders([]));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold text-ink">Customers</h1>
        <p className="text-ink-muted text-sm mt-1">{customers.length} registered customers</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {customers.length === 0 ? (
          <p className="text-center text-ink-muted py-12">No registered customers yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-ink-muted">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Phone</th>
                  <th className="p-4 font-medium">Orders</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => {
                  const orderCount = orders.filter((o) => o.userId === c.id).length;
                  return (
                    <tr key={c.id} className="border-b border-gray-50">
                      <td className="p-4 font-medium">{c.name}</td>
                      <td className="p-4 text-ink-muted">{c.email || "—"}</td>
                      <td className="p-4">{c.phone || "—"}</td>
                      <td className="p-4">{orderCount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
