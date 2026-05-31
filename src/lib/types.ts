export type Category =
  | "teddy-bear"
  | "big-teddy-bear"
  | "giant-teddy-bear"
  | "panda"
  | "personalized";

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string;
  images: string[];
  category: Category;
  subcategory?: string;
  tags: string[];
  inStock: boolean;
  featured?: boolean;
  exclusive?: boolean;
  popularity: number;
  rating: number;
  createdAt: string;
  variants?: ProductVariant[];
  customizable?: boolean;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  customization?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
}

export interface Address {
  label: string;
  street: string;
  city: string;
  county: string;
  phone: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "confirmed" | "delivered";
  paymentMethod: "mpesa" | "card" | "cod";
  createdAt: string;
  shipping: Address;
}
