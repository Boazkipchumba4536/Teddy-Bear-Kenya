"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { BEAR_SIZES, SIZE_PRICES } from "@/lib/products";
import { formatKES } from "@/lib/format";
import type { BearColor, BearSize } from "@/types/product";
import { BEAR_COLORS, BEAR_COLOR_HEX } from "@/lib/bearColors";

const BASE_STYLES = [
  { id: "classic", name: "Classic Bear", emoji: "🧸", priceMod: 0 },
  { id: "sitting", name: "Sitting Bear", emoji: "🪑", priceMod: 500 },
  { id: "standing", name: "Standing Bear", emoji: "🐻", priceMod: 800 },
];

const COLORS: { id: BearColor; hex: string }[] = BEAR_COLORS.filter(
  (c) => c !== "Custom" && c !== "Multicolor"
).map((id) => ({
  id,
  hex: BEAR_COLOR_HEX[id].startsWith("linear") ? "#9E9E9E" : BEAR_COLOR_HEX[id],
}));

const ACCESSORIES = [
  { id: "bow", name: "Ribbon Bow", price: 200 },
  { id: "heart", name: "Heart Patch", price: 150 },
  { id: "flower", name: "Flower", price: 250 },
];

const STEPS = ["Base Bear", "Size", "Color", "Accessories", "Embroidery", "Message"];

export default function CustomBearWizard() {
  const addItem = useCartStore((s) => s.addItem);
  const [step, setStep] = useState(0);
  const [base, setBase] = useState(BASE_STYLES[0]);
  const [size, setSize] = useState<BearSize>("M");
  const [color, setColor] = useState<BearColor>("Brown");
  const [accessories, setAccessories] = useState<string[]>([]);
  const [embroidery, setEmbroidery] = useState("");
  const [message, setMessage] = useState("");
  const [added, setAdded] = useState(false);

  const total = useMemo(() => {
    let price = SIZE_PRICES[size] + base.priceMod;
    if (embroidery) price += 500;
    accessories.forEach((id) => {
      const acc = ACCESSORIES.find((a) => a.id === id);
      if (acc) price += acc.price;
    });
    return price;
  }, [size, base, accessories, embroidery]);

  const toggleAccessory = (id: string) => {
    setAccessories((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleAddToCart = () => {
    const details = [
      `Style: ${base.name}`,
      `Color: ${color}`,
      accessories.length ? `Accessories: ${accessories.join(", ")}` : null,
      embroidery ? `Embroidery: "${embroidery}"` : null,
      message ? `Card: "${message}"` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    addItem(
      {
        productId: `custom-${Date.now()}`,
        slug: "custom-bear",
        name: `Custom ${base.name}${embroidery ? ` — "${embroidery}"` : ""}`,
        image: "/images/image2.webp",
        size,
        color,
        quantity: 1,
        price: total,
        isCustom: true,
        customDetails: details,
        personalMessage: message || undefined,
      },
      { openDrawer: true }
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex gap-1 mb-2">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-caramel" : "bg-caramel/20"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-ink-muted">
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-card min-h-[320px]"
          >
            {step === 0 && (
              <div className="grid sm:grid-cols-3 gap-4">
                {BASE_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setBase(style)}
                    className={`p-6 rounded-2xl border-2 text-center transition-all ${
                      base.id === style.id
                        ? "border-caramel bg-caramel/5"
                        : "border-caramel/15 hover:border-caramel/40"
                    }`}
                  >
                    <span className="text-5xl block mb-3">{style.emoji}</span>
                    <p className="font-medium">{style.name}</p>
                    {style.priceMod > 0 && (
                      <p className="text-xs text-ink-muted mt-1">+{formatKES(style.priceMod)}</p>
                    )}
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-wrap gap-3">
                {BEAR_SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`px-6 py-4 min-h-[44px] rounded-full border-2 font-medium transition-all ${
                      size === s
                        ? "border-caramel bg-caramel text-white"
                        : "border-caramel/20 hover:border-caramel/40"
                    }`}
                  >
                    {s} — {formatKES(SIZE_PRICES[s])}
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-wrap gap-4">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    className={`flex items-center gap-3 px-5 py-3 rounded-full border-2 transition-all ${
                      color === c.id ? "border-caramel" : "border-caramel/15"
                    }`}
                  >
                    <span
                      className="w-8 h-8 rounded-full border border-ink/10"
                      style={{ backgroundColor: c.hex }}
                    />
                    {c.id}
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-wrap gap-3">
                {ACCESSORIES.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => toggleAccessory(acc.id)}
                    className={`px-5 py-3 min-h-[44px] rounded-full border-2 text-sm font-medium transition-all ${
                      accessories.includes(acc.id)
                        ? "border-caramel bg-caramel/10 text-caramel"
                        : "border-caramel/15"
                    }`}
                  >
                    {acc.name} (+{formatKES(acc.price)})
                  </button>
                ))}
              </div>
            )}

            {step === 4 && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Embroidery name (max 12 characters) — +{formatKES(500)}
                </label>
                <input
                  type="text"
                  maxLength={12}
                  value={embroidery}
                  onChange={(e) => setEmbroidery(e.target.value)}
                  className="input-field mb-4"
                  placeholder="e.g. Wanjiru"
                />
                <div className="bg-blush/30 rounded-2xl p-8 text-center">
                  <span className="text-6xl">🧸</span>
                  {embroidery && (
                    <p className="mt-4 font-display text-xl text-caramel">
                      &ldquo;{embroidery}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Personal card message</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input-field resize-none"
                  placeholder="Write your heartfelt message…"
                  maxLength={200}
                />
                <p className="text-xs text-ink-light mt-1 text-right">{message.length}/200</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={prev}
            disabled={step === 0}
            className="btn-outline disabled:opacity-40"
          >
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="btn-primary">
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className={`${added ? "bg-mpesa" : "btn-primary"} inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 min-h-[44px] text-sm font-semibold text-white`}
            >
              {added ? "✓ Added to Cart!" : `Add Custom Bear to Cart — ${formatKES(total)}`}
            </button>
          )}
        </div>
      </div>

      {/* Live summary sidebar */}
      <aside className="lg:sticky lg:top-24 h-fit">
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h3 className="font-display text-lg font-medium mb-4">Your Custom Bear</h3>
          <div className="bg-blush/20 rounded-xl p-6 text-center mb-4">
            <span className="text-7xl">{base.emoji}</span>
            {embroidery && (
              <p className="mt-2 font-display text-caramel">&ldquo;{embroidery}&rdquo;</p>
            )}
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Style</dt>
              <dd>{base.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Size</dt>
              <dd>{size}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Color</dt>
              <dd>{color}</dd>
            </div>
            {accessories.length > 0 && (
              <div className="flex justify-between">
                <dt className="text-ink-muted">Extras</dt>
                <dd>{accessories.join(", ")}</dd>
              </div>
            )}
          </dl>
          <div className="border-t border-caramel/10 mt-4 pt-4 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-caramel">{formatKES(total)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
