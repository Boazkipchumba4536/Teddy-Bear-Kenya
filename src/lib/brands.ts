/** Teddy bear brands/collections used for shop filters and admin */
export const TEDDY_BRANDS = [
  "BearHug KE",
  "Charlie Bears",
  "Steiff",
  "Teddy-Hermann",
  "Hermann-Spielwaren",
  "Bear Bears",
  "Schuco",
  "Japanese",
  "Tambo Teddies",
  "Little Teddy Shop",
] as const;

export type TeddyBrand = (typeof TEDDY_BRANDS)[number];

export function mergeBrandOptions(existing: string[]): string[] {
  const set = new Set<string>([...TEDDY_BRANDS, ...existing.filter(Boolean)]);
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
