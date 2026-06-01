"use client";

import Link from "next/link";
import { UserCog } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

/** Staff admin entry in the storefront navbar only. */
export default function StaffNavLink({ className = "" }: { className?: string }) {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const href = isAdmin ? "/admin" : "/admin/login";

  return (
    <Link
      href={href}
      title="Staff"
      aria-label="Staff admin"
      className={`group relative flex flex-col items-center justify-center rounded-full p-2.5 min-w-[44px] min-h-[44px] hover:bg-caramel/10 transition-colors ${className}`}
    >
      <UserCog className="w-5 h-5 text-ink/60 group-hover:text-caramel transition-colors" />
      <span className="sr-only">staff</span>
      <span
        aria-hidden
        className="absolute -bottom-0.5 text-[8px] font-bold uppercase tracking-widest text-ink/35 group-hover:text-caramel"
      >
        staff
      </span>
    </Link>
  );
}
