import type { BearColor } from "@/types/product";

/** All selectable bear colors (shop filters + admin). */
export const BEAR_COLORS: BearColor[] = [
  "Brown",
  "White",
  "Cream",
  "Pink",
  "Red",
  "Blue",
  "Purple",
  "Green",
  "Yellow",
  "Grey",
  "Black",
  "Multicolor",
  "Custom",
];

export const BEAR_COLOR_HEX: Record<BearColor, string> = {
  Brown: "#8B5E3C",
  White: "#FFF8F0",
  Cream: "#F5E6C8",
  Pink: "#F5C5C5",
  Red: "#C45C4A",
  Blue: "#4A6FA5",
  Purple: "#7B5EA7",
  Green: "#5A7A5A",
  Yellow: "#E8C547",
  Grey: "#9E9E9E",
  Black: "#2C2C2C",
  Multicolor: "linear-gradient(135deg, #F5C5C5 0%, #4A6FA5 50%, #E8C547 100%)",
  Custom: "#B8860B",
};

export function normalizeBearColor(value: string | null | undefined): BearColor {
  if (!value) return "Brown";
  const match = BEAR_COLORS.find((c) => c.toLowerCase() === value.toLowerCase());
  return match ?? "Custom";
}

export function isBearColor(value: string): value is BearColor {
  return BEAR_COLORS.includes(value as BearColor);
}

/** Inline style for color swatch buttons (supports gradient for Multicolor). */
export function bearColorSwatchStyle(color: BearColor): {
  background?: string;
  backgroundColor?: string;
} {
  const value = BEAR_COLOR_HEX[color] ?? BEAR_COLOR_HEX.Custom;
  if (value.startsWith("linear-gradient")) return { background: value };
  return { backgroundColor: value };
}
