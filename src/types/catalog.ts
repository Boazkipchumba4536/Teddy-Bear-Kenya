import type { SiteSettings, Testimonial } from "@/types/admin";
import type { Product } from "@/types/product";

export type CatalogBundle = {
  products: Product[];
  testimonials: Testimonial[];
  settings: SiteSettings;
  productsFromDatabase: boolean;
  testimonialsFromDatabase: boolean;
};
