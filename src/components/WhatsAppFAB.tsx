"use client";

import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site";

export default function WhatsAppFAB() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order via WhatsApp"
      className="fixed bottom-20 md:bottom-6 right-4 z-30 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-elevated flex items-center justify-center hover:scale-105 transition-transform"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
