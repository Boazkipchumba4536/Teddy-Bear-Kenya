/** Shop filter bounds — show every product in the database. */
export const SHOP_PRICE_MIN = 0;
export const SHOP_PRICE_MAX = 100_000;

export function catalogPriceMax(prices: number[]): number {
  if (!prices.length) return SHOP_PRICE_MAX;
  const peak = Math.max(...prices);
  return Math.max(SHOP_PRICE_MAX, Math.ceil(peak / 1000) * 1000);
}
