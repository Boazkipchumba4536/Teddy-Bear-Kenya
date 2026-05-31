import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import { HERO_IMAGE, IMAGE_SIZES } from "@/lib/images";
import { site } from "@/lib/site";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-sand">
      <div className="container-main w-full py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Copy */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <p className="section-label animate-fade-up">Nairobi&apos;s Finest Plush Bears</p>
            <h1 className="font-display text-[2.75rem] sm:text-5xl lg:text-[3.5rem] font-medium text-ink leading-[1.05] tracking-tight mb-6 animate-fade-up">
              Gifts that speak
              <em className="not-italic text-gradient block">from the heart</em>
            </h1>
            <p className="text-ink-muted text-lg leading-relaxed mb-10 max-w-md animate-fade-up">
              Life-size teddy bears up to 160cm, personalized name embroidery, and
              same-day delivery across Kenya. Crafted for birthdays, love, and every
              special moment.
            </p>
            <div className="flex flex-wrap gap-3 mb-12 animate-fade-up">
              <Link href="/shop" className="btn-primary group">
                Explore collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/contact" className="btn-secondary">
                Get a quote
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-ink/10 animate-fade-up">
              {[
                { value: "160cm", label: "Max size" },
                { value: "100+", label: "Happy clients" },
                { value: "KSh 500", label: "Name embroidery" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl font-medium text-ink">{stat.value}</p>
                  <p className="text-xs text-ink-light mt-0.5 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div className="lg:col-span-7 order-1 lg:order-2 relative">
            <div className="relative aspect-[4/5] lg:aspect-[5/6] rounded-4xl overflow-hidden shadow-elevated">
              <ProductImage
                src={HERO_IMAGE}
                alt="Premium giant teddy bear Kenya"
                priority
                sizes={IMAGE_SIZES.hero}
              />
            </div>
            {/* Floating card */}
            <Link
              href="/shop?category=giant-teddy-bear"
              className="absolute -bottom-4 -left-2 sm:-left-6 bg-white rounded-3xl p-5 shadow-glow max-w-[220px] hover:-translate-y-1 transition-transform group"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-wine mb-1">
                Bestseller
              </p>
              <p className="font-display text-lg font-medium text-ink leading-snug mb-2">
                Giant Teddy Bears
              </p>
              <p className="text-xs text-ink-muted flex items-center gap-1 group-hover:text-wine transition">
                From KSh 4,000 <ArrowUpRight className="w-3 h-3" />
              </p>
            </Link>
            {/* Location pill */}
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 text-xs font-medium text-ink shadow-soft">
              📍 {site.address.line1}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
