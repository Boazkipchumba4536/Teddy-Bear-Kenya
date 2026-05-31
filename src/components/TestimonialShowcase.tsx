"use client";

import { useState } from "react";
import ProductImage from "@/components/ProductImage";
import { IMAGE_SIZES, TESTIMONIAL_IMAGES } from "@/lib/images";
import { site } from "@/lib/site";

const quotes = [
  {
    text: "The giant teddy bear was absolutely perfect! My girlfriend cried happy tears. Delivery was fast and the quality exceeded expectations.",
    author: "James M.",
    location: "Nairobi",
  },
  {
    text: "Ordered a personalized bear for my daughter's birthday. The name embroidery was beautiful and the bear is so soft. Will definitely order again!",
    author: "Grace W.",
    location: "Mombasa",
  },
  {
    text: "Best gift shop in Kenya! The panda bear was huge and exactly as pictured. WhatsApp ordering was super easy.",
    author: "David K.",
    location: "Kisumu",
  },
];

export default function TestimonialShowcase() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-20 md:py-28 bg-sand overflow-hidden">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="section-label">Customer love</p>
            <h2 className="section-title mb-6">
              {site.stats.happyClients} happy clients and counting
            </h2>
            <blockquote className="relative">
              <p className="font-display text-xl md:text-2xl text-ink leading-relaxed mb-6 transition-opacity duration-500">
                &ldquo;{quotes[active].text}&rdquo;
              </p>
              <footer className="flex items-center gap-4">
                <div>
                  <p className="font-semibold text-ink">{quotes[active].author}</p>
                  <p className="text-sm text-ink-muted">{quotes[active].location}</p>
                </div>
              </footer>
            </blockquote>
            <div className="flex gap-2 mt-8">
              {quotes.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === active ? "w-8 bg-wine" : "w-4 bg-ink/15 hover:bg-ink/25"
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {TESTIMONIAL_IMAGES.slice(0, 6).map((src, i) => (
              <div
                key={src}
                className={`relative rounded-2xl overflow-hidden bg-white shadow-card ${
                  i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
                }`}
              >
                <ProductImage src={src} alt={`Customer photo ${i + 1}`} sizes={IMAGE_SIZES.testimonial} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
