import Link from "next/link";
import Image from "next/image";
import { Instagram, MapPin, Phone } from "lucide-react";
import { IMAGE_SIZES, LOGO_IMAGE } from "@/lib/images";
import { site, whatsappLink } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-ink text-white mt-auto">
      {/* CTA strip */}
      <div className="border-b border-white/10">
        <div className="container-main py-16 md:py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-medium leading-tight mb-3">
              Ready to make someone smile?
            </h2>
            <p className="text-white/60 max-w-md">
              Order via WhatsApp for the fastest response. We deliver teddy bears
              countrywide from our Nairobi showroom.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-wine">
              Chat on WhatsApp
            </a>
            <Link href="/shop" className="btn-outline-white">
              Browse shop
            </Link>
          </div>
        </div>
      </div>

      <div className="container-main py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-5">
            <Image
              src={LOGO_IMAGE}
              alt={site.name}
              width={40}
              height={40}
              sizes={IMAGE_SIZES.logo}
              className="rounded-full ring-1 ring-white/20"
            />
            <span className="font-display text-xl font-medium">{site.name}</span>
          </div>
          <p className="text-white/50 text-sm leading-relaxed mb-5">{site.description}</p>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-champagne transition"
          >
            <Instagram className="w-4 h-4" />
            @teddybearhavenkenya
          </a>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">Shop</h3>
          <ul className="space-y-3 text-sm text-white/60">
            {[
              { href: "/shop", label: "All teddy bears" },
              { href: "/shop?category=giant-teddy-bear", label: "Giant bears" },
              { href: "/shop?category=personalized", label: "Personalized" },
              { href: "/shop?category=panda", label: "Panda bears" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white transition">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">Account</h3>
          <ul className="space-y-3 text-sm text-white/60">
            {[
              { href: "/account", label: "My account" },
              { href: "/orders", label: "Order history" },
              { href: "/cart", label: "Shopping cart" },
              { href: "/contact", label: "Contact us" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white transition">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">Visit us</h3>
          <ul className="space-y-4 text-sm text-white/60">
            <li className="flex gap-3">
              <MapPin className="w-4 h-4 shrink-0 text-champagne mt-0.5" />
              <span>
                {site.address.line1}
                <br />
                {site.address.line2}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="w-4 h-4 shrink-0 text-champagne" />
              <a href={`tel:+${site.whatsapp}`} className="hover:text-white transition">
                {site.phoneDisplay}
              </a>
            </li>
            <li className="text-xs text-white/40 pt-2">
              M-Pesa Till: {site.mpesa.till1} · {site.mpesa.till2}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container-main flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-white/35">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>{site.hours}</p>
        </div>
      </div>
    </footer>
  );
}
