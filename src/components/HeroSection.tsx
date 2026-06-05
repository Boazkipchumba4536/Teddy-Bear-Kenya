"use client";

import Link from "next/link";
import { ArrowRight, Truck } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";
import { HERO_CAROUSEL_IMAGES } from "@/lib/images";
import ImageFadeCarousel from "@/components/ImageFadeCarousel";

export default function HeroSection() {
  return (
    <section className="hero-banner">
      <div className="hero-banner-bg">
        <ImageFadeCarousel
          images={HERO_CAROUSEL_IMAGES}
          alt="BearHug KE teddy bears"
          priority
          sizes="100vw"
          className="absolute inset-0"
          intervalMs={5500}
        />
        <div className="hero-banner-overlay absolute inset-0 z-[2]" aria-hidden />
      </div>

      <div className="container-main relative z-10 w-full pb-12 md:pb-16 pt-32 md:pt-36">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-accent-light mb-4">
            {site.tagline}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight">
            Teddy bears that make every moment unforgettable.
          </h1>
          <p className="mt-5 text-base md:text-lg text-white/75 max-w-lg leading-relaxed">
            Premium plush gifts for every occasion. Same-day delivery in Nairobi. Pay with M-Pesa,
            shipped nationwide.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
            <Link href="/shop" className="btn-primary !bg-white !text-ink hover:!bg-white/90 group">
              Shop all bears
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/custom"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 text-white px-6 py-3 min-h-[44px] text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Build custom bear
            </Link>
            <a
              href={whatsappLink("Hi BearHug KE! I'd like help choosing a teddy bear.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] text-white px-6 py-3 min-h-[44px] text-sm font-semibold hover:bg-[#20bd5a] transition-colors shadow-lg"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <div className="hero-stat">
              <p className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">
                Happy clients
              </p>
              <p className="text-lg font-bold text-white mt-0.5">{site.stats.happyClients}</p>
            </div>
            <div className="hero-stat">
              <p className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">
                Delivery
              </p>
              <p className="text-lg font-bold text-white mt-0.5 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-accent-light" aria-hidden />
                {site.stats.delivery}
              </p>
            </div>
            <div className="hero-stat">
              <p className="text-[10px] uppercase tracking-widest text-white/50 font-semibold">
                Checkout
              </p>
              <p className="text-lg font-bold text-mpesa-light mt-0.5">M-Pesa</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
