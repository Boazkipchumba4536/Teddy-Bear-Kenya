"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, MapPin, LogOut, User } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, orders, wishlist } = useStore();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <User className="w-12 h-12 mx-auto text-brand-300 mb-4" />
        <h1 className="font-display text-2xl font-bold mb-2">My Account</h1>
        <p className="text-cocoa/60 mb-6">Please log in to view your account.</p>
        <Link href="/login" className="btn-primary">
          Login / Register
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Hello, {user.name}</h1>
          <p className="text-cocoa/60">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="btn-secondary py-2 px-4 text-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <Link href="/orders" className="card p-6 hover:shadow-md transition group">
          <Package className="w-8 h-8 text-rose-600 mb-3" />
          <h2 className="font-semibold group-hover:text-rose-600">Orders</h2>
          <p className="text-sm text-cocoa/50">{orders.length} order(s)</p>
        </Link>
        <Link
          href="/shop?wishlist=1"
          className="card p-6 hover:shadow-md transition group"
        >
          <span className="text-3xl block mb-2">❤️</span>
          <h2 className="font-semibold group-hover:text-rose-600">Wishlist</h2>
          <p className="text-sm text-cocoa/50">{wishlist.length} item(s)</p>
        </Link>
        <div className="card p-6 sm:col-span-2">
          <MapPin className="w-8 h-8 text-rose-600 mb-3" />
          <h2 className="font-semibold mb-2">Account details</h2>
          <dl className="text-sm space-y-1 text-cocoa/70">
            <div className="flex gap-2">
              <dt className="font-medium text-cocoa w-20">Name:</dt>
              <dd>{user.name}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium text-cocoa w-20">Email:</dt>
              <dd>{user.email}</dd>
            </div>
            {user.phone && (
              <div className="flex gap-2">
                <dt className="font-medium text-cocoa w-20">Phone:</dt>
                <dd>{user.phone}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
