"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Truck } from "lucide-react";
import { site } from "@/lib/site";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-ink text-white text-center text-xs py-2.5 px-12 relative">
      <div className="flex items-center justify-center gap-2 font-medium tracking-wide">
        <Truck className="w-3.5 h-3.5 shrink-0 opacity-70" />
        <span>
          Free gift wrapping · {site.stats.delivery} delivery · M-Pesa {site.mpesa.till1}
        </span>
        <Link
          href="/shop"
          className="hidden sm:inline-flex items-center gap-1 ml-2 text-champagne hover:text-white transition"
        >
          Shop now <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-lg leading-none"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
