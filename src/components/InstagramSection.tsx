import Link from "next/link";
import { Instagram } from "lucide-react";
import { UGC_IMAGES } from "@/lib/products";
import { site } from "@/lib/site";

export default function InstagramSection() {
  return (
    <section className="section-pad bg-cream/40 border-t border-caramel/8">
      <div className="container-main">
        <div className="text-center mb-8 md:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta mb-3">
            Community
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-ink">
            Tag us {site.instagram}
          </h2>
          <p className="text-ink-muted mt-2 text-sm md:text-base">
            Share your BearHug moments — we love seeing your joy
          </p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {UGC_IMAGES.map((src, i) => (
            <a
              key={i}
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 hover:scale-[1.03]"
            >
              <img
                src={src}
                alt={`Customer photo ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/35 transition-colors flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
        <p className="text-center mt-6">
          <Link
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-caramel hover:text-caramel-dark transition-colors"
          >
            Follow on Instagram →
          </Link>
        </p>
      </div>
    </section>
  );
}
