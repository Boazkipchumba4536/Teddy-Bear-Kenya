"use client";

import { Truck, Zap, RotateCcw } from "lucide-react";
import { useSiteSettings } from "@/hooks/useCatalog";
import { formatKES } from "@/lib/format";

export default function DeliveryTrustStrip() {
  const settings = useSiteSettings();

  return (
    <div className="bg-market-orange text-white text-center text-[12px] sm:text-[13px] font-medium">
      <div className="container-main py-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <span className="inline-flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 shrink-0" />
          Free delivery on orders above {formatKES(settings.freeDeliveryThreshold)}
        </span>
        <span className="hidden sm:inline text-white/50">|</span>
        <span className="inline-flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 shrink-0 fill-white" />
          Express delivery available in Nairobi
        </span>
        <span className="hidden sm:inline text-white/50">|</span>
        <span className="inline-flex items-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5 shrink-0" />
          Easy returns on eligible items
        </span>
      </div>
    </div>
  );
}
