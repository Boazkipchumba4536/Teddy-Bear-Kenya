"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Heart,
  MapPin,
  LogOut,
  User,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { signOutUser } from "@/lib/actions/auth";
import { fetchUserOrders } from "@/lib/actions/orders";
import { site } from "@/lib/site";
import { formatKES } from "@/lib/format";
import PageLoader from "@/components/PageLoader";
import EmptyState from "@/components/EmptyState";
import type { Order } from "@/types/order";

export default function AccountPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const user = useAuthStore((s) => s.user);
  const authLoaded = useAuthStore((s) => s.loaded);
  const clear = useAuthStore((s) => s.clear);
  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const cartCount = useCartStore((s) => s.itemCount());

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!authLoaded || !user) return;
    fetchUserOrders().then(setOrders);
  }, [authLoaded, user]);

  if (!mounted || !authLoaded) {
    return <PageLoader label="Loading account…" />;
  }

  if (!user) {
    return (
      <EmptyState
        icon={User}
        title="My Account"
        description="Sign in to track orders, manage your wishlist, and checkout faster."
        actionLabel="Sign in / Register"
        actionHref="/login"
        secondaryLabel="Browse shop"
        secondaryHref="/shop"
      />
    );
  }

  const recentOrder = orders[0];

  return (
    <div className="container-main py-10 max-w-3xl">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <p className="text-sm text-caramel font-medium mb-1">Welcome back</p>
          <h1 className="font-display text-3xl font-medium">Hello, {user.name.split(" ")[0]}</h1>
          <p className="text-ink-muted text-sm mt-1">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={async () => {
            await signOutUser();
            clear();
            router.push("/");
            router.refresh();
          }}
          className="btn-outline text-sm py-2 px-4 shrink-0"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: "Orders", value: orders.length, icon: Package },
          { label: "Wishlist", value: wishlistCount, icon: Heart },
          { label: "In Cart", value: cartCount, icon: ShoppingBag },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-card text-center">
            <Icon className="w-5 h-5 text-caramel mx-auto mb-2" />
            <p className="text-2xl font-semibold text-ink">{value}</p>
            <p className="text-xs text-ink-muted">{label}</p>
          </div>
        ))}
      </div>

      {recentOrder && (
        <div className="bg-caramel/10 rounded-2xl p-5 mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-caramel">Latest Order</p>
            <Link href="/orders" className="text-xs text-caramel hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <p className="font-medium">{recentOrder.id}</p>
          <p className="text-sm text-ink-muted">
            {formatKES(recentOrder.total)} ·{" "}
            <span className="capitalize">{recentOrder.status.replace(/_/g, " ")}</span>
          </p>
          <Link href="/track" className="text-sm text-caramel font-medium mt-2 inline-block hover:underline">
            Track this order →
          </Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/orders"
          className="bg-white rounded-2xl p-6 shadow-card hover:shadow-soft transition group"
        >
          <Package className="w-8 h-8 text-caramel mb-3" />
          <h2 className="font-semibold group-hover:text-caramel">My Orders</h2>
          <p className="text-sm text-ink-muted">{orders.length} order(s)</p>
        </Link>
        <Link
          href="/wishlist"
          className="bg-white rounded-2xl p-6 shadow-card hover:shadow-soft transition group"
        >
          <Heart className="w-8 h-8 text-caramel mb-3" />
          <h2 className="font-semibold group-hover:text-caramel">Wishlist</h2>
          <p className="text-sm text-ink-muted">{wishlistCount} saved bear(s)</p>
        </Link>
        <Link
          href="/shop"
          className="bg-white rounded-2xl p-6 shadow-card hover:shadow-soft transition group"
        >
          <ShoppingBag className="w-8 h-8 text-caramel mb-3" />
          <h2 className="font-semibold group-hover:text-caramel">Continue Shopping</h2>
          <p className="text-sm text-ink-muted">Browse our collection</p>
        </Link>
        <Link
          href="/contact"
          className="bg-white rounded-2xl p-6 shadow-card hover:shadow-soft transition group"
        >
          <User className="w-8 h-8 text-caramel mb-3" />
          <h2 className="font-semibold group-hover:text-caramel">Support</h2>
          <p className="text-sm text-ink-muted">Contact our team</p>
        </Link>
        <div className="bg-white rounded-2xl p-6 shadow-card sm:col-span-2">
          <MapPin className="w-8 h-8 text-caramel mb-3" />
          <h2 className="font-semibold mb-2">Visit Us</h2>
          <p className="text-sm text-ink-muted">
            {site.address.line1}, {site.address.line2}
            <br />
            {site.address.city}, {site.address.country}
          </p>
          <p className="text-xs text-ink-light mt-2">{site.hours}</p>
        </div>
      </div>
    </div>
  );
}
