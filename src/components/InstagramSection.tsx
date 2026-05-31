import Link from "next/link";
import { Instagram } from "lucide-react";
import { site } from "@/lib/site";

export default function InstagramSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-blush">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <Instagram className="w-10 h-10 text-rose-500 mx-auto mb-4" />
        <span className="section-eyebrow">Follow us on Instagram</span>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-cocoa mb-3">
          @teddybearhavenkenya
        </h2>
        <p className="text-cocoa/55 mb-6 leading-relaxed">
          🧸 Birthdays · Love · Apologies · Just Because
          <br />
          🚚 Countrywide Delivery · 📞 {site.phoneDisplay}
          <br />
          M-Pesa Till: {site.mpesa.till1} or {site.mpesa.till2}
        </p>
        <Link
          href={site.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Follow on Instagram
        </Link>
      </div>
    </section>
  );
}
