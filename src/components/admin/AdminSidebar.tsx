"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  X,
} from "lucide-react";
import { signOutUser } from "@/lib/actions/auth";
import { notifyAuthChanged } from "@/lib/authEvents";
import { useAuthStore } from "@/store/authStore";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const clear = useAuthStore((s) => s.clear);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        role="dialog"
        aria-modal={open}
        aria-label="Admin navigation"
        className={`fixed top-0 left-0 h-full w-[min(280px,88vw)] bg-ink text-cream z-[60] flex flex-col shadow-elevated transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-cream/10 flex items-center justify-between min-h-[4rem]">
          <div className="min-w-0">
            <p className="font-semibold truncate">BearHug Admin</p>
            <p className="text-xs text-cream/50 mt-0.5 truncate">{user?.name ?? "Admin"}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-cream/10 shrink-0"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(href, exact)
                  ? "bg-violet text-white"
                  : "text-cream/70 hover:bg-cream/10 hover:text-cream"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-cream/10 space-y-1">
          <Link
            href="/"
            target="_blank"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-cream/70 hover:bg-cream/10 hover:text-cream"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            View store
          </Link>
          <button
            type="button"
            onClick={async () => {
              await signOutUser();
              clear();
              notifyAuthChanged();
              onClose();
              router.push("/admin/login");
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-cream/70 hover:bg-red-900/30 hover:text-red-200"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
