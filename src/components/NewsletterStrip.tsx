"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";

export default function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setDone(true);
  };

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-[2rem] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-700 via-rose-600 to-rose-500" />
          <div className="absolute inset-0 bg-grain opacity-30" />
          <div className="relative grid md:grid-cols-2 gap-10 p-10 md:p-14 items-center">
            <div className="text-white">
              <p className="text-gold-light font-bold text-xs uppercase tracking-widest mb-3">
                Teddy bear updates
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
                New bears &amp; size drops
              </h2>
              <p className="text-white/75 text-sm md:text-base max-w-md">
                Be first to know when new giant teddy bears arrive and when we run
                Nairobi flash sales.
              </p>
            </div>

            {done ? (
              <div className="bg-white/15 backdrop-blur rounded-2xl p-8 text-white text-center">
                <p className="text-3xl mb-2">🧸</p>
                <p className="font-bold">You&apos;re on the list!</p>
                <p className="text-sm text-white/70 mt-1">New teddy alerts coming soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 rounded-full px-5 py-3.5 text-cocoa bg-white shadow-card focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-600-dark text-white px-6 py-3.5 font-bold hover:bg-cocoa transition shadow-soft"
                >
                  <Send className="w-4 h-4" />
                  Subscribe
                </button>
              </form>
            )}

            <a
              href="https://wa.me/254700000000?text=Hi%20Teddy%20Bear%20Kenya!%20Help%20me%20pick%20a%20teddy%20bear."
              target="_blank"
              rel="noopener noreferrer"
              className="md:col-span-2 inline-flex items-center justify-center gap-2 text-white/90 text-sm font-semibold hover:text-white transition"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp us to choose the right teddy bear size
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
