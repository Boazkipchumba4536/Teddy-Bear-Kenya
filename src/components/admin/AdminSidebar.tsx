"use client";

import { useEffect, useState } from "react";
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
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { signOutUser } from "@/lib/actions/auth";
import { useAuthStore } from "@/store/authStore";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const STORAGE_KEY = "bearhug-admin-sidebar";

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export default function AdminSidebar({ collapsed, onCollapsedChange }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const clear = useAuthStore((s) => s.clear);
  const user = useAuthStore((s) => s.user);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const toggleCollapsed = () => {
    const next = !collapsed;
    onCollapsedChange(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  const sidebarWidth = collapsed ? "w-[4.5rem]" : "w-64";

  const NavLink = ({
    href,
    label,
    icon: Icon,
    exact,
  }: (typeof navItems)[0]) => (
    <Link
      href={href}
      onClick={() => setMobileOpen(false)}
      title={collapsed ? label : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        collapsed ? "justify-center px-0" : ""
      } ${
        isActive(href, exact)
          ? "bg-caramel text-white"
          : "text-cream/70 hover:bg-cream/10 hover:text-cream"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );

  return (
    <>
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 bg-ink text-cream h-14 flex items-center justify-between px-4 border-b border-cream/10">
        <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-display font-semibold text-sm">BearHug Admin</span>
        <Link href="/" target="_blank" aria-label="View store">
          <ExternalLink className="w-5 h-5" />
        </Link>
      </div>

      <aside
        className={`fixed top-0 left-0 h-full ${sidebarWidth} bg-ink text-cream z-50 flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className={`p-4 border-b border-cream/10 flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display font-semibold truncate">BearHug Admin</p>
              <p className="text-xs text-cream/50 mt-0.5 truncate">{user?.name ?? "Admin"}</p>
            </div>
          )}
          <div className={`flex items-center gap-1 ${collapsed ? "" : ""}`}>
            <button
              type="button"
              className="hidden lg:flex p-2 rounded-lg hover:bg-cream/10"
              onClick={toggleCollapsed}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              className="lg:hidden p-1"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        <div className="p-3 border-t border-cream/10 space-y-1">
          <Link
            href="/"
            target="_blank"
            title={collapsed ? "View Store" : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-cream/70 hover:bg-cream/10 hover:text-cream ${
              collapsed ? "justify-center px-0" : ""
            }`}
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            {!collapsed && "View Store"}
          </Link>
          <button
            type="button"
            title={collapsed ? "Sign Out" : undefined}
            onClick={async () => {
              await signOutUser();
              clear();
              router.push("/admin/login");
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-cream/70 hover:bg-red-900/30 hover:text-red-200 ${
              collapsed ? "justify-center px-0" : ""
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && "Sign Out"}
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}

export function useAdminSidebarState() {
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1279px)");
    const applyAuto = () => {
      if (mq.matches) {
        setCollapsed(true);
        return;
      }
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === "1") setCollapsed(true);
        else if (saved === "0") setCollapsed(false);
        else setCollapsed(false);
      } catch {
        setCollapsed(false);
      }
    };
    applyAuto();
    setReady(true);
    mq.addEventListener("change", applyAuto);
    return () => mq.removeEventListener("change", applyAuto);
  }, []);

  return { collapsed, setCollapsed, ready, contentPad: collapsed ? "lg:pl-[4.5rem]" : "lg:pl-64" };
}
