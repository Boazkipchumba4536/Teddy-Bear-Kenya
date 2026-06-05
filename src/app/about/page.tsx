import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Truck, Shield } from "lucide-react";
import { ABOUT_IMAGE } from "@/lib/images";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: `About Us | ${site.name}`,
  description:
    "BearHug KE is Nairobi's teddy bear gift shop — premium plush bears, M-Pesa checkout, and same-day delivery across Kenya.",
};

const values = [
  {
    icon: Heart,
    title: "Made with love",
    text: "Every bear is chosen for softness, durability, and that first-hug feeling your recipient deserves.",
  },
  {
    icon: Truck,
    title: "Kenya-wide delivery",
    text: "Same-day in Nairobi when you order before noon. Careful packaging and tracking for the rest of the country.",
  },
  {
    icon: Shield,
    title: "Trusted checkout",
    text: "Pay safely with M-Pesa or card. Real order numbers, real support on WhatsApp when you need us.",
  },
  {
    icon: MapPin,
    title: "Rooted in Nairobi",
    text: "We're a local team serving birthdays, Valentine's, baby showers, and everyday surprises nationwide.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-cream">
      <section className="relative overflow-hidden bg-ink text-cream">
        <div className="container-main py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-blush text-sm font-semibold uppercase tracking-wider mb-3">About BearHug KE</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight">
              Every bear tells a story.
            </h1>
            <p className="text-cream/70 mt-6 text-lg leading-relaxed">
              We started BearHug KE to make gift-giving in Kenya feel personal again — beautiful teddy bears,
              honest pricing in KSh, and delivery you can count on from Nairobi to the coast and beyond.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/shop" className="btn-primary bg-caramel">
                Shop all bears
              </Link>
              <a
                href={whatsappLink("Hi BearHug KE! I'd like to know more about your bears.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] text-white px-6 py-3 min-h-[44px] text-sm font-semibold hover:bg-[#20bd5a] transition-colors shadow-lg"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-elevated">
            <Image
              src={ABOUT_IMAGE}
              alt="BearHug KE teddy bears"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={75}
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="container-main py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="font-display text-3xl font-semibold text-ink">Our mission</h2>
          <p className="text-ink-muted mt-4 leading-relaxed">
            Whether it&apos;s a giant Valentine surprise, a baby shower bundle, or a get-well hug, we help you
            say it with something soft, lasting, and delivered on time. Our catalog grows weekly — curated
            bears for every budget and every occasion.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-white rounded-2xl p-6 shadow-card">
              <Icon className="w-8 h-8 text-caramel mb-4" />
              <h3 className="font-semibold text-ink mb-2">{title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-main pb-20">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-card grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink mb-4">Visit & contact</h2>
            <p className="text-ink-muted text-sm leading-relaxed">
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              {site.address.city}, {site.address.country}
            </p>
            <p className="text-sm text-ink-muted mt-4">{site.hours}</p>
            <p className="text-sm mt-4">
              <a href={`tel:${site.phone}`} className="text-caramel font-medium hover:underline">
                {site.phoneDisplay}
              </a>
              {" · "}
              <a href={`mailto:${site.email}`} className="text-caramel font-medium hover:underline">
                {site.email}
              </a>
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-5xl mb-4">🧸</p>
            <p className="font-display text-xl text-ink">Ready to send a hug?</p>
            <Link href="/shop" className="btn-primary bg-caramel mt-6 inline-flex">
              Browse the shop
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
