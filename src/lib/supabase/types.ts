export interface DbProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  in_stock: boolean;
  tagline: string;
  description: string;
  care_instructions: string;
  delivery_info: string;
  price: number;
  size: string;
  color: string;
  occasions: string[];
  image: string;
  images: string[];
  badge: string | null;
  featured: boolean;
  created_at: string;
}

export interface DbTestimonial {
  id: string;
  name: string;
  city: string;
  rating: number;
  quote: string;
  occasion: string;
  created_at?: string;
}

export interface DbSiteSettings {
  id: number;
  name: string;
  tagline: string;
  phone: string;
  phone_display: string;
  email: string;
  whatsapp: string;
  mpesa_till: string;
  free_delivery_threshold: number;
  standard_delivery_fee: number;
  gift_wrap_fee: number;
  hours: string;
}

export interface DbOrder {
  id: string;
  user_id: string | null;
  phone: string;
  status: string;
  subtotal: number;
  delivery_fee: number;
  gift_wrap: boolean;
  total: number;
  payment_method: string;
  shipping: Record<string, unknown>;
  items: Record<string, unknown>[];
  created_at: string;
}

export interface DbProfile {
  id: string;
  name: string;
  phone: string | null;
  role: string;
  created_at: string;
}
