"use client";

import { Truck, Smartphone, MessageCircle, Award } from "lucide-react";
import { useSiteSettings } from "@/hooks/useCatalog";
import ScrollReveal from "@/components/loading/ScrollReveal";

export default function TrustBar() {
  const settings = useSiteSettings();

  const features = [
    {
      icon: Truck,
      title: "Same-day Nairobi delivery",
      desc: "Order before cutoff · We deliver hugs fast",
    },
    {
      icon: Smartphone,
      title: "Pay via M-Pesa",
      desc: `Secure Till ${settings.mpesaTill}`,
    },
    {
      icon: MessageCircle,
      title: "WhatsApp support",
      desc: "Real humans · Quick order help",
    },
    {
      icon: Award,
      title: "Premium quality",
      desc: "Soft plush · Gift-ready packaging",
    },
  ];

  return (
    <section className="py-10 md:py-12 border-y border-ink/5 bg-surface">
      <div className="container-main">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <ScrollReveal key={title} delay={i * 0.05}>
              <div className="flex gap-3 p-4 rounded-xl bg-white border border-ink/5 h-full">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-accent" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-semibold text-ink text-sm leading-snug">{title}</h3>
                  <p className="text-ink-muted text-xs mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
