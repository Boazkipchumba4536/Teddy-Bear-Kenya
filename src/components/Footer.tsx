"use client";

import { useState } from "react";
import Link from "next/link";
import { Smartphone } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";
import { reopenCookieSettings } from "@/components/CookieConsent";
import { useAuthStore } from "@/store/authStore";
import { toastSuccess } from "@/store/toastStore";

const shopLinks = [
  { href: "/shop", label: "All Teddy Bears" },
  { href: "/shop?occasion=Valentine's", label: "Valentine's" },
  { href: "/shop?occasion=Birthday", label: "Birthday Bears" },
  { href: "/custom", label: "Custom Bears" },
  { href: "/shop?size=Giant", label: "Giant Bears" },
];

const helpLinks = [
  { href: "/contact", label: "Contact Us" },
  { href: "/track", label: "Track Order" },
  { href: "/orders", label: "My Orders" },
  { href: whatsappLink(), label: "WhatsApp Shop" },
];

const companyLinks = [
  { href: "/about", label: "About BearHug KE" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: site.instagramUrl, label: "Instagram" },
];

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-bold text-white mb-4">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    window.open(
      whatsappLink(
        `Hi BearHug KE, I'd like 10% off my first order. Newsletter email: ${email.trim()}`
      ),
      "_blank",
      "noopener,noreferrer"
    );
    setSubmitted(true);
    toastSuccess("Open WhatsApp to confirm your welcome offer.");
  };

  return (
    <footer className="bg-violet text-white mt-auto">
      <div className="container-main py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block text-xl font-bold text-white mb-4">
              {site.name}
            </Link>
            <p className="text-sm text-white/75 leading-relaxed mb-6 max-w-xs">
              Premium plush teddy bears — same-day Nairobi delivery, M-Pesa checkout, gifts
              that feel like a warm hug.
            </p>
            <div className="rounded-xl bg-white/10 border border-white/15 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-blush mb-2">
                Get 10% off
              </p>
              {submitted ? (
                <p className="text-sm text-white/80">
                  Thanks! Confirm via WhatsApp to claim your offer.
                </p>
              ) : (
                <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-lg bg-white text-violet font-semibold px-5 py-2.5 text-sm hover:bg-blush transition-colors"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <LinkColumn title="Shop" links={shopLinks} />
            <LinkColumn title="Help" links={helpLinks} />
            <div>
              <LinkColumn title="Company" links={companyLinks} />
              <Link
                href="/admin/login"
                className="mt-4 inline-block text-xs text-white/50 hover:text-white/80"
              >
                {isAdmin ? "Admin dashboard" : "Staff login"}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 bg-mpesa text-white font-bold px-3 py-1.5 rounded-lg text-xs">
              <Smartphone className="w-3.5 h-3.5" />
              M-PESA
            </span>
            <span className="text-white/70">Till</span>
            <span className="font-bold text-white">{site.mpesa.till}</span>
            {site.mpesa.till2 && (
              <span className="text-white/50 text-xs">· Alt {site.mpesa.till2}</span>
            )}
          </div>
          <div className="text-center md:text-right text-xs text-white/55">
            <p>
              © {new Date().getFullYear()} {site.name}. {site.address.city},{" "}
              {site.address.country}.
            </p>
            <button
              type="button"
              onClick={reopenCookieSettings}
              className="mt-2 hover:text-white underline"
            >
              Cookie preferences
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
