"use client";

import { useMemo } from "react";
import { Star, ExternalLink } from "lucide-react";
import { useTestimonials } from "@/hooks/useCatalog";
import ScrollReveal from "@/components/loading/ScrollReveal";
import type { Testimonial } from "@/types/admin";

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?q=BearHug+KE+teddy+bear+Nairobi+reviews";

const REVIEW_AGO = ["2 weeks ago", "1 month ago", "2 months ago", "3 months ago", "4 months ago"];

function GoogleLogo({ className = "h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "fill-[#FBBC04] text-[#FBBC04]" : "fill-gray-200 text-gray-200"
          }`}
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

function avatarColor(name: string) {
  const colors = ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#9C27B0", "#00ACC1"];
  return colors[name.charCodeAt(0) % colors.length];
}

function GoogleReviewCard({
  testimonial,
  postedAgo,
}: {
  testimonial: Testimonial;
  postedAgo: string;
}) {
  const initial = testimonial.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <article className="flex flex-col h-full w-[min(100%,320px)] shrink-0 bg-white rounded-xl border border-gray-200/90 shadow-sm p-5 text-left">
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
          style={{ backgroundColor: avatarColor(testimonial.name) }}
          aria-hidden
        >
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink text-sm leading-tight">{testimonial.name}</p>
          <p className="text-xs text-ink-muted mt-0.5">
            {testimonial.city ? `${testimonial.city} · ` : ""}
            {postedAgo}
          </p>
        </div>
        <GoogleLogo className="h-4 w-4 shrink-0 opacity-90" />
      </div>
      <StarRow rating={testimonial.rating} />
      <p className="mt-3 text-sm text-ink-muted leading-relaxed flex-1 line-clamp-4">
        {testimonial.quote}
      </p>
      {testimonial.occasion && (
        <p className="mt-3 text-[11px] text-ink-light">Gift · {testimonial.occasion}</p>
      )}
    </article>
  );
}

export default function TestimonialCarousel() {
  const testimonials = useTestimonials();

  const averageRating = useMemo(() => {
    if (!testimonials.length) return 5;
    const sum = testimonials.reduce((a, t) => a + t.rating, 0);
    return Math.round((sum / testimonials.length) * 10) / 10;
  }, [testimonials]);

  const marqueeItems = useMemo(() => {
    if (!testimonials.length) return [];
    const minCards = Math.max(10, testimonials.length * 2);
    const items: { testimonial: Testimonial; postedAgo: string; key: string }[] = [];
    for (let i = 0; i < minCards; i++) {
      const t = testimonials[i % testimonials.length];
      items.push({
        testimonial: t,
        postedAgo: REVIEW_AGO[i % REVIEW_AGO.length],
        key: `${t.id}-${i}`,
      });
    }
    return [...items, ...items];
  }, [testimonials]);

  if (testimonials.length === 0) return null;

  return (
    <section className="section-pad bg-surface overflow-hidden">
      <div className="container-main">
        <ScrollReveal className="text-center mb-8 md:mb-10">
          <p className="section-eyebrow">Real love stories</p>
          <h2 className="section-title mt-3">What our customers say</h2>
        </ScrollReveal>

        <ScrollReveal>
          <div className="max-w-4xl mx-auto mb-8 md:mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-gray-200 px-5 py-4 shadow-sm">
              <div className="flex items-center gap-3">
                <GoogleLogo className="h-8 w-8" />
                <div>
                  <p className="text-sm font-semibold text-ink">Google Reviews</p>
                  <p className="text-xs text-ink-muted">BearHug KE on Google</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:justify-end">
                <span className="text-3xl font-bold text-ink leading-none">{averageRating}</span>
                <div>
                  <StarRow rating={5} />
                  <p className="text-xs text-ink-muted mt-1">
                    Based on {testimonials.length}+ reviews
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className="relative mt-2">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-8 md:w-16 z-10 bg-gradient-to-r from-surface to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-8 md:w-16 z-10 bg-gradient-to-l from-surface to-transparent"
          aria-hidden
        />
        <div className="overflow-hidden">
          <div className="review-marquee-track flex gap-4 md:gap-5 py-1">
            {marqueeItems.map(({ testimonial, postedAgo, key }) => (
              <GoogleReviewCard key={key} testimonial={testimonial} postedAgo={postedAgo} />
            ))}
          </div>
        </div>
      </div>

      <div className="container-main mt-8 text-center">
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a73e8] hover:underline"
        >
          <GoogleLogo className="h-4 w-4" />
          Read reviews on Google
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
}
