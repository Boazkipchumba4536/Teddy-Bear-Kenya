"use client";

import { useState } from "react";
import { MapPin, MessageCircle, Phone, Mail, CreditCard, ArrowUpRight } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div>
      <div className="bg-sand border-b border-ink/5">
        <div className="container-main py-14 md:py-20">
          <p className="section-label">Get in touch</p>
          <h1 className="section-title mb-4">We&apos;d love to hear from you</h1>
          <p className="section-subtitle">
            Need help choosing the right size? WhatsApp us for the fastest reply — we typically respond within minutes.
          </p>
        </div>
      </div>

      <div className="container-main py-14 md:py-20">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="lg:col-span-2 space-y-4">
            {[
              {
                icon: MessageCircle,
                title: "WhatsApp (fastest)",
                body: (
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-wine font-semibold hover:underline"
                  >
                    Open WhatsApp <ArrowUpRight className="w-4 h-4" />
                  </a>
                ),
              },
              {
                icon: Phone,
                title: "Phone",
                body: (
                  <a href={`tel:+${site.whatsapp}`} className="text-ink-muted hover:text-ink transition">
                    {site.phoneDisplay}
                  </a>
                ),
              },
              {
                icon: MapPin,
                title: "Showroom",
                body: (
                  <>
                    {site.address.line1}
                    <br />
                    {site.address.line2}
                    <br />
                    <span className="text-ink-light text-sm">{site.hours}</span>
                  </>
                ),
              },
              {
                icon: CreditCard,
                title: "M-Pesa Till",
                body: `${site.mpesa.till1} · ${site.mpesa.till2}`,
              },
              {
                icon: Mail,
                title: "Email",
                body: (
                  <a href={`mailto:${site.email}`} className="text-ink-muted hover:text-ink transition">
                    {site.email}
                  </a>
                ),
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4 p-5 rounded-3xl bg-sand">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-card">
                  <Icon className="w-5 h-5 text-wine" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="font-semibold text-ink text-sm mb-1">{title}</h2>
                  <p className="text-ink-muted text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <div className="card p-8 md:p-10">
              {sent ? (
                <div className="text-center py-16">
                  <p className="text-5xl mb-5">🧸</p>
                  <h2 className="font-display text-2xl font-medium text-ink mb-2">Message sent!</h2>
                  <p className="text-ink-muted">We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-medium text-ink mb-2">Send a message</h2>
                  <p className="text-ink-muted text-sm mb-8">
                    Tell us the occasion, preferred size, and colour — we&apos;ll recommend the perfect bear.
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSent(true);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input required className="input-field" placeholder="Your name" aria-label="Name" />
                      <input required type="email" className="input-field" placeholder="Email" aria-label="Email" />
                    </div>
                    <input type="tel" className="input-field" placeholder="Phone (07XX XXX XXX)" aria-label="Phone" />
                    <textarea
                      required
                      rows={5}
                      className="input-field resize-none"
                      placeholder="Which teddy bear size or colour do you need? Any name for embroidery?"
                      aria-label="Message"
                    />
                    <button type="submit" className="btn-primary w-full sm:w-auto">
                      Send message
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-4xl overflow-hidden h-80 shadow-card">
          <iframe
            title="Teddy Bear Kenya location"
            src="https://maps.google.com/maps?q=Yala+Towers+Nairobi+CBD&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
