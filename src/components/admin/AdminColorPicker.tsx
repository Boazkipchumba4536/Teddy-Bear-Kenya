"use client";

import type { BearColor } from "@/types/product";
import { BEAR_COLORS, BEAR_COLOR_HEX } from "@/lib/bearColors";

type Props = {
  value: BearColor;
  onChange: (color: BearColor) => void;
  label?: string;
};

export default function AdminColorPicker({ value, onChange, label = "Color" }: Props) {
  return (
    <div className="sm:col-span-2">
      <label className="text-sm font-medium mb-2 block">{label}</label>
      <div className="flex flex-wrap gap-2">
        {BEAR_COLORS.map((c) => {
          const selected = value === c;
          const hex = BEAR_COLOR_HEX[c];
          const isGradient = hex.startsWith("linear-gradient");

          return (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              title={c}
              className={`inline-flex items-center gap-2 rounded-xl border-2 px-2.5 py-1.5 transition-all active:scale-[0.98] ${
                selected
                  ? "border-caramel bg-caramel/10 shadow-sm"
                  : "border-caramel/15 bg-white hover:border-caramel/40"
              }`}
            >
              <span
                className="w-7 h-7 rounded-full border border-ink/10 shrink-0"
                style={
                  isGradient
                    ? { background: hex }
                    : { backgroundColor: hex }
                }
              />
              <span className={`text-xs font-medium ${selected ? "text-caramel" : "text-ink"}`}>
                {c}
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-ink-muted mt-2">
        Selected: <strong>{value}</strong>
      </p>
    </div>
  );
}
