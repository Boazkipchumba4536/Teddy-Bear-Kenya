"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ShoppingCart, Users, TrendingUp, DollarSign } from "lucide-react";
import { useCatalogStore } from "@/store/catalogStore";
import AdminSetupBanner from "@/components/admin/AdminSetupBanner";
import { fetchAllCustomers, fetchAllOrders } from "@/lib/actions/orders";
import { formatKES } from "@/lib/format";
import type { Order } from "@/types/order";
import type { User } from "@/types/order";

export default function AdminDashboard() {
  const products = useCatalogStore((s) => s.products);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);

  useEffect(() => {
    fetchAllOrders().then(setOrders).catch(() => setOrders([]));
    fetchAllCustomers().then(setCustomers).catch(() => setCustomers([]));
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status !== "delivered").length;

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, href: "/admin/products" },
    { label: "Total Orders", value: orders.length, icon: ShoppingCart, href: "/admin/orders" },
    { label: "Pending Orders", value: pendingOrders, icon: TrendingUp, href: "/admin/orders" },
    { label: "Customers", value: customers.length, icon: Users, href: "/admin/customers" },
    { label: "Revenue", value: formatKES(totalRevenue), icon: DollarSign, href: "/admin/orders" },
  ];

  return (
    <div>
      <AdminSetupBanner />
      <div className="mb-8">
        <h1 className="text-2xl font-display font-semibold text-ink">Dashboard</h1>
        <p className="text-ink-muted text-sm mt-1">Overview of your BearHug KE store</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl p-5 shadow-card hover:shadow-soft transition group"
          >
            <Icon className="w-5 h-5 text-caramel mb-3" />
            <p className="text-2xl font-semibold text-ink group-hover:text-caramel transition-colors">
              {value}
            </p>
            <p className="text-xs text-ink-muted mt-1">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-caramel hover:underline">
              View all
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-ink-muted py-4">No orders yet.</p>
          ) : (
            <ul className="space-y-3">
              {orders.slice(0, 5).map((o) => (
                <li key={o.id} className="flex justify-between items-center text-sm border-b border-gray-100 pb-3 last:border-0">
                  <div>
                    <p className="font-medium text-caramel">{o.id}</p>
                    <p className="text-ink-muted text-xs">{o.shipping.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatKES(o.total)}</p>
                    <p className="text-xs text-ink-muted capitalize">{o.status.replace(/_/g, " ")}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: "/admin/products/new", label: "Add Product" },
              { href: "/admin/orders", label: "Manage Orders" },
              { href: "/admin/testimonials", label: "Testimonials" },
              { href: "/admin/settings", label: "Store Settings" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-4 py-3 rounded-xl border border-caramel/20 text-sm font-medium text-center hover:bg-caramel/5 hover:border-caramel/40 transition"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
