"use client";

import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { reopenCookieSettings } from "@/components/CookieConsent";

const footerLinks = {
  Shop: [
    { href: "/shop", label: "All Bears" },
    { href: "/shop?occasion=Valentine's", label: "Valentine's" },
    { href: "/shop?occasion=Birthday", label: "Birthday" },
    { href: "/custom", label: "Custom Bears" },
    { href: "/wishlist", label: "Wishlist" },
  ],
  Help: [
    { href: "/track", label: "Track Order" },
    { href: "/orders", label: "My Orders" },
    { href: "/contact", label: "Contact Us" },
    { href: "/account", label: "My Account" },
    { href: "/forgot-password", label: "Forgot Password" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: site.instagramUrl, label: "Instagram" },
  ],
  Legal: [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
  "Follow Us": [
    { href: site.instagramUrl, label: site.instagram },
    { href: whatsappLink(), label: "WhatsApp" },
    { href: `mailto:${site.email}`, label: site.email },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-ink text-cream mt-auto">
      <div className="container-main py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-blush">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/70 hover:text-cream transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="bg-mpesa text-white text-xs font-bold px-3 py-1.5 rounded">M-PESA</span>
            <span className="text-xs text-cream/60">Visa</span>
            <span className="text-xs text-cream/60">Mastercard</span>
          </div>
          <div className="flex flex-col md:items-end gap-2 text-sm text-cream/60">
            <p>© 2026 {site.name}. Made with 🧸 in Nairobi.</p>
            <button
              type="button"
              onClick={reopenCookieSettings}
              className="text-xs text-cream/50 hover:text-cream underline text-left md:text-right"
            >
              Cookie preferences
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
