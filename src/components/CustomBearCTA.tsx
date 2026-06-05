"use client";



import Link from "next/link";

import { Sparkles, Scissors, Gift } from "lucide-react";

import ScrollReveal from "@/components/loading/ScrollReveal";

import ImageFadeCarousel from "@/components/ImageFadeCarousel";

import { CUSTOM_BEAR_CAROUSEL_IMAGES } from "@/lib/images";



const perks = [

  { icon: Scissors, label: "Custom embroidery" },

  { icon: Gift, label: "Ribbons & accessories" },

  { icon: Sparkles, label: "Gift-ready packaging" },

];



export default function CustomBearCTA() {

  return (

    <section className="section-pad bg-blush/30 border-y border-blush-dark/30">

      <div className="container-main">

        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center rounded-3xl bg-white/70 backdrop-blur-sm p-6 md:p-10 lg:p-12 shadow-card ring-1 ring-caramel/10">

          <ScrollReveal>

            <p className="section-eyebrow">Make it yours</p>

            <h2 className="section-title mt-3 mb-4">

              Build a bear as unique as your story

            </h2>

            <p className="text-ink-muted mb-6 leading-relaxed">

              Custom embroidery, ribbons, and accessories. Watch your bear come to life step by

              step, delivered anywhere in Kenya.

            </p>

            <ul className="flex flex-wrap gap-3 mb-8">

              {perks.map(({ icon: Icon, label }) => (

                <li

                  key={label}

                  className="inline-flex items-center gap-2 text-sm font-medium text-ink bg-cream rounded-full px-4 py-2"

                >

                  <Icon className="w-4 h-4 text-caramel" strokeWidth={1.75} />

                  {label}

                </li>

              ))}

            </ul>

            <Link

              href="/custom"

              className="btn-primary hover:scale-[1.03] active:scale-[0.98] inline-flex"

            >

              Start Building

            </Link>

          </ScrollReveal>



          <ScrollReveal delay={0.12} className="relative">

            <div className="relative aspect-square max-w-md mx-auto rounded-2xl overflow-hidden shadow-elevated">

              <ImageFadeCarousel

                images={CUSTOM_BEAR_CAROUSEL_IMAGES}

                alt="Custom teddy bear gifts from BearHug KE"

                sizes="(max-width: 768px) 80vw, 400px"

                className="absolute inset-0"

                intervalMs={4500}

              />

            </div>

          </ScrollReveal>

        </div>

      </div>

    </section>

  );

}

