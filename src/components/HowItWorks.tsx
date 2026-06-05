"use client";

import { ShoppingBag, PenLine, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ScrollReveal from "@/components/loading/ScrollReveal";

const steps: { num: string; icon: LucideIcon; title: string; desc: string }[] = [
  {
    num: "01",
    icon: ShoppingBag,
    title: "Choose your bear",
    desc: "Browse premium plush bears by occasion, size, and colour.",
  },
  {
    num: "02",
    icon: PenLine,
    title: "Add a personalised message",
    desc: "Include a heartfelt note, gift wrap, or custom embroidery.",
  },
  {
    num: "03",
    icon: Truck,
    title: "Delivered to their door",
    desc: "Same-day in Nairobi · Trusted delivery across Kenya.",
  },
];

export function HowItWorks() {
  return (
    <section className="section-pad bg-cream paw-pattern">
      <div className="container-main">
        <ScrollReveal className="text-center mb-12 md:mb-14">
          <p className="section-eyebrow">Simple & joyful</p>
          <h2 className="section-title mt-3">How it works</h2>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {steps.map((step, i) => (
            <ScrollReveal key={step.num} delay={i * 0.1}>
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card text-center h-full transition-all duration-500 hover:shadow-elevated hover:-translate-y-1">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-blush/50 flex items-center justify-center mb-5">
                  <step.icon className="w-6 h-6 text-caramel" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-terracotta">
                  Step {step.num}
                </span>
                <h3 className="font-display text-xl font-medium mt-2 mb-2 text-ink">
                  {step.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
