"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { checkIsAdmin } from "@/lib/actions/admin";
import AdminSidebar, { useAdminSidebarState } from "./AdminSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const authLoaded = useAuthStore((s) => s.loaded);
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const { collapsed, setCollapsed, ready, contentPad } = useAdminSidebarState();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!authLoaded) return;

    async function verify() {
      if (isLoginPage) {
        const ok = await checkIsAdmin();
        if (ok) router.replace("/admin");
        setChecking(false);
        return;
      }

      const ok = await checkIsAdmin();
      setAllowed(ok);
      setChecking(false);
      if (!ok) router.replace("/admin/login");
    }

    verify();
  }, [authLoaded, isLoginPage, router]);

  if (!authLoaded || checking || (!isLoginPage && !ready)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-ink-muted">
        Loading admin…
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!allowed) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <div className={`${contentPad} pt-14 lg:pt-0 transition-[padding] duration-300`}>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
