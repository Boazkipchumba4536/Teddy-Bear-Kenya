"use client";

import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { reopenCookieSettings } from "@/components/CookieConsent";
import { useAuthStore } from "@/store/authStore";

const helpLinks = [
  { href: "/contact", label: "Customer Service" },
  { href: "/track", label: "Track Order" },
  { href: "/orders", label: "My Orders" },
  { href: "/account", label: "My Account" },
];

const usefulLinks = [
  { href: "/shop", label: "All Teddy Bears" },
  { href: "/shop?occasion=Valentine's", label: "Valentine's Bears" },
  { href: "/shop?occasion=Birthday", label: "Birthday Bears" },
  { href: "/shop?occasion=Anniversary", label: "Anniversary Bears" },
  { href: "/shop?size=Giant", label: "Giant Teddy Bears" },
  { href: "/shop?size=L", label: "Large Teddy Bears" },
  { href: "/shop?size=M", label: "Medium Teddy Bears" },
  { href: "/custom", label: "Custom Bears" },
  { href: "/wishlist", label: "Wishlist" },
];

const aboutLinks = [
  { href: "/about", label: "About BearHug KE" },
  { href: site.instagramUrl, label: "Instagram" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
];

const shopLinks = [
  { href: "/login", label: "Sign In / Register" },
  { href: whatsappLink(), label: "WhatsApp Shop" },
  { href: `mailto:${site.email}`, label: site.email },
  { href: "/contact", label: "Contact Us" },
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
      <h3 className="font-bold text-white text-sm mb-4">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[13px] text-gray-400 hover:text-market-orange transition-colors"
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

  return (
    <footer className="bg-[#2e2e2e] text-gray-300 mt-auto">
      <div className="container-main py-12 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <LinkColumn title="Help" links={helpLinks} />
          <LinkColumn title="Useful Links" links={usefulLinks} />
          <div>
            <h3 className="font-bold text-white text-sm mb-4">About</h3>
            <ul className="space-y-2.5">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-gray-400 hover:text-market-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin/login"
                  className="text-[13px] text-gray-500 hover:text-gray-400 transition-colors"
                >
                  {isAdmin ? "Admin dashboard" : "Staff login"}
                </Link>
              </li>
            </ul>
          </div>
          <LinkColumn title="Shop With Us" links={shopLinks} />
        </div>

        <div className="border-t border-gray-600 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="bg-mpesa text-white text-xs font-bold px-3 py-1.5 rounded">
              M-PESA
            </span>
            <span className="text-xs text-gray-500 border border-gray-600 px-2 py-1 rounded">
              Lipa na M-Pesa
            </span>
            <span className="text-xs text-gray-500">Till {site.mpesa.till}</span>
          </div>
          <div className="text-center md:text-right text-[12px] text-gray-500">
            <p>
              © {new Date().getFullYear()} {site.name}. All rights reserved.
            </p>
            <button
              type="button"
              onClick={reopenCookieSettings}
              className="mt-2 text-gray-500 hover:text-market-orange underline block md:ml-auto"
            >
              Cookie preferences
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
