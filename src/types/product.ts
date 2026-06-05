export type BearSize = "S" | "M" | "L" | "Giant";
export type BearColor =
  | "Brown"
  | "White"
  | "Cream"
  | "Pink"
  | "Red"
  | "Blue"
  | "Purple"
  | "Green"
  | "Yellow"
  | "Grey"
  | "Black"
  | "Multicolor"
  | "Custom";
export type Occasion =
  | "Valentine's"
  | "Birthday"
  | "Anniversary"
  | "Baby Shower"
  | "Get Well"
  | "Just Because";

export type ProductBadge = "Best Seller" | "New Arrival";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  inStock: boolean;
  tagline: string;
  description: string;
  careInstructions: string;
  deliveryInfo: string;
  price: number;
  size: BearSize;
  color: BearColor;
  occasions: Occasion[];
  image: string;
  images: string[];
  badge?: ProductBadge;
  featured?: boolean;
  createdAt: string;
}

export interface SizePrice {
  size: BearSize;
  price: number;
}

export interface CartLineItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  size: BearSize;
  color: BearColor;
  quantity: number;
  price: number;
  personalMessage?: string;
  isCustom?: boolean;
  customDetails?: string;
}
