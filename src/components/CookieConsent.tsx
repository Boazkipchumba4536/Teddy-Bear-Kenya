"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  COOKIE_CONSENT_KEY,
  getCookieConsent,
  hasCookieConsentChoice,
  setCookieConsent,
} from "@/lib/cookieConsent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!hasCookieConsentChoice());

    const onChange = () => setVisible(!hasCookieConsentChoice());
    window.addEventListener("bearhug:cookie-consent", onChange);
    return () => window.removeEventListener("bearhug:cookie-consent", onChange);
  }, []);

  if (!visible) return null;

  const current = getCookieConsent();

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="fixed bottom-16 md:bottom-0 inset-x-0 z-[60] p-4 md:p-6 pointer-events-none"
    >
      <div className="container-main max-w-4xl mx-auto pointer-events-auto">
        <div className="bg-ink text-cream rounded-2xl shadow-elevated p-5 md:p-6 border border-cream/10">
          <h2 id="cookie-consent-title" className="font-display text-lg font-semibold">
            Cookies & privacy
          </h2>
          <p id="cookie-consent-desc" className="text-sm text-cream/80 mt-2 leading-relaxed">
            We use essential storage for your cart and account, and optional cookies to improve
            the shop. Read our{" "}
            <Link href="/cookies" className="text-blush underline hover:text-cream">
              Cookie Policy
            </Link>
            ,{" "}
            <Link href="/privacy" className="text-blush underline hover:text-cream">
              Privacy Policy
            </Link>
            , and{" "}
            <Link href="/terms" className="text-blush underline hover:text-cream">
              Terms
            </Link>
            .
          </p>
          {current && (
            <p className="text-xs text-cream/50 mt-2">
              Current preference: {current.status === "accepted" ? "Accepted" : "Declined"}
            </p>
          )}
          <div className="flex flex-wrap gap-3 mt-5">
            <button
              type="button"
              onClick={() => {
                setCookieConsent("accepted");
                setVisible(false);
              }}
              className="btn-primary bg-caramel text-sm py-2.5 px-5"
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={() => {
                setCookieConsent("declined");
                setVisible(false);
              }}
              className="text-sm py-2.5 px-5 rounded-xl border border-cream/30 text-cream hover:bg-cream/10 transition-colors"
            >
              Decline non-essential
            </button>
            <Link
              href="/cookies"
              className="text-sm py-2.5 px-2 text-cream/70 hover:text-cream underline self-center"
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Call from footer to reopen banner after decline */
export function reopenCookieSettings() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    window.dispatchEvent(new Event("bearhug:cookie-consent"));
  }
}
