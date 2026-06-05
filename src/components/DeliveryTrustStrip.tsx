"use client";

import { useSiteSettings } from "@/hooks/useCatalog";
import { formatKES } from "@/lib/format";

export default function DeliveryTrustStrip() {
  const settings = useSiteSettings();

  return (
    <div className="fixed top-0 left-0 right-0 z-[52] bg-accent text-white text-center text-[11px] sm:text-xs font-semibold tracking-wide">
      <div className="container-main py-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <span>Free delivery above {formatKES(settings.freeDeliveryThreshold)}</span>
        <span className="hidden sm:inline opacity-50" aria-hidden>
          ·
        </span>
        <span>Same-day Nairobi · M-Pesa accepted</span>
      </div>
    </div>
  );
}
