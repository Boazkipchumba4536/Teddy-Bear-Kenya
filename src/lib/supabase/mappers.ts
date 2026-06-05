import type { SiteSettings, Testimonial } from "@/types/admin";
import type { Order, PaymentMethod } from "@/types/order";
import type { BearColor, BearSize, CartLineItem, Occasion, Product, ProductBadge } from "@/types/product";
import type { DbOrder, DbProduct, DbSiteSettings, DbTestimonial } from "./types";

export type DbProductListRow = Pick<
  DbProduct,
  | "id"
  | "slug"
  | "name"
  | "tagline"
  | "price"
  | "size"
  | "color"
  | "occasions"
  | "image"
  | "badge"
  | "featured"
  | "created_at"
> & {
  brand?: string | null;
  in_stock?: boolean | null;
};

export function mapProductList(row: DbProductListRow): Product {
  return mapProduct({
    ...row,
    brand: row.brand ?? "",
    in_stock: row.in_stock ?? true,
    images: row.image ? [row.image] : [],
    description: "",
    care_instructions: "",
    delivery_info: "",
  });
}

export function mapProduct(row: DbProduct): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand:
      row.brand ||
      (row.tagline?.replace(/ collection.*$/i, "").trim() ?? ""),
    inStock:
      row.in_stock ??
      !row.tagline?.toLowerCase().includes("out of stock"),
    tagline: row.tagline,
    description: row.description ?? "",
    careInstructions: row.care_instructions ?? "",
    deliveryInfo: row.delivery_info ?? "",
    price: row.price,
    size: row.size as BearSize,
    color: row.color as BearColor,
    occasions: row.occasions as Occasion[],
    image: row.image,
    images: row.images?.length ? row.images : [row.image],
    badge: (row.badge as ProductBadge) ?? undefined,
    featured: row.featured,
    createdAt: row.created_at,
  };
}

export function mapProductToDb(
  data: Omit<Product, "id" | "createdAt"> & { id?: string; createdAt?: string }
): Omit<DbProduct, "id" | "created_at"> & { id?: string; created_at?: string } {
  return {
    ...(data.id ? { id: data.id } : {}),
    slug: data.slug,
    name: data.name,
    brand: data.brand ?? "",
    in_stock: data.inStock ?? true,
    tagline: data.tagline,
    description: data.description,
    care_instructions: data.careInstructions,
    delivery_info: data.deliveryInfo,
    price: data.price,
    size: data.size,
    color: data.color,
    occasions: data.occasions,
    image: data.image,
    images: data.images?.length ? data.images : [data.image],
    badge: data.badge ?? null,
    featured: data.featured ?? false,
    created_at: data.createdAt,
  };
}

export function mapTestimonial(row: DbTestimonial): Testimonial {
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    rating: row.rating,
    quote: row.quote,
    occasion: row.occasion,
  };
}

export function mapSiteSettings(row: DbSiteSettings): SiteSettings {
  return {
    name: row.name,
    tagline: row.tagline,
    phone: row.phone,
    phoneDisplay: row.phone_display,
    email: row.email,
    whatsapp: row.whatsapp,
    mpesaTill: row.mpesa_till,
    freeDeliveryThreshold: row.free_delivery_threshold,
    standardDeliveryFee: row.standard_delivery_fee,
    giftWrapFee: row.gift_wrap_fee,
    hours: row.hours,
  };
}

export function mapSiteSettingsToDb(
  data: SiteSettings
): Omit<DbSiteSettings, "id"> {
  return {
    name: data.name,
    tagline: data.tagline,
    phone: data.phone,
    phone_display: data.phoneDisplay,
    email: data.email,
    whatsapp: data.whatsapp,
    mpesa_till: data.mpesaTill,
    free_delivery_threshold: data.freeDeliveryThreshold,
    standard_delivery_fee: data.standardDeliveryFee,
    gift_wrap_fee: data.giftWrapFee,
    hours: data.hours,
  };
}

export function mapOrder(row: DbOrder): Order {
  return {
    id: row.id,
    userId: row.user_id ?? undefined,
    phone: row.phone,
    status: row.status as Order["status"],
    createdAt: row.created_at,
    total: row.total,
    subtotal: row.subtotal,
    deliveryFee: row.delivery_fee,
    giftWrap: row.gift_wrap,
    items: row.items as unknown as CartLineItem[],
    shipping: row.shipping as unknown as Order["shipping"],
    paymentMethod: row.payment_method as PaymentMethod,
  };
}
