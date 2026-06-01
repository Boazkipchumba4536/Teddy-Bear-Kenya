"use client";

import Link from "next/link";
import { UserCog } from "lucide-react";

/** Subtle staff entry — visible on hover, links to admin login. */
export default function StaffAccess() {
  return (
    <Link
      href="/admin/login"
      title="staff"
      aria-label="staff"
      className="fixed bottom-20 right-3 z-40 md:bottom-6 md:right-4 flex items-center justify-center w-8 h-8 rounded-full bg-ink/5 text-ink/25 hover:bg-ink/10 hover:text-ink/50 transition-all opacity-40 hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-caramel/40"
    >
      <UserCog className="w-3.5 h-3.5" strokeWidth={1.75} />
      <span className="sr-only">staff</span>
    </Link>
  );
}
