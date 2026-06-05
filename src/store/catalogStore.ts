import { create } from "zustand";
import type { Product } from "@/types/product";
import type { SiteSettings, Testimonial } from "@/types/admin";
import { DEFAULT_TESTIMONIALS } from "@/lib/products";

interface CatalogState {
  products: Product[];
  /** Set from admin layout (fast count query) — use on dashboard instead of loading all products. */
  catalogProductCount: number;
  testimonials: Testimonial[];
  settings: SiteSettings;
  loaded: boolean;
  loading: boolean;
  productsFromDatabase: boolean;
  testimonialsFromDatabase: boolean;
  hydrate: (data: {
    products: Product[];
    testimonials: Testimonial[];
    settings: SiteSettings;
    productsFromDatabase?: boolean;
    testimonialsFromDatabase?: boolean;
  }) => void;
  setProducts: (products: Product[]) => void;
  setTestimonials: (testimonials: Testimonial[]) => void;
  setSettings: (settings: SiteSettings) => void;
  setLoading: (loading: boolean) => void;
  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
}

export const defaultSiteSettings: SiteSettings = {
  name: "BearHug KE",
  tagline: "Every bear tells a story.",
  phone: "0712667782",
  phoneDisplay: "+254 712 667 782",
  email: "hello@bearhugke.co.ke",
  whatsapp: "254712667782",
  mpesaTill: "9466773",
  freeDeliveryThreshold: 3000,
  standardDeliveryFee: 300,
  giftWrapFee: 150,
  hours: "Mon–Sat: 9am – 6pm",
};

export const useCatalogStore = create<CatalogState>((set, get) => ({
  products: [],
  catalogProductCount: 0,
  testimonials: DEFAULT_TESTIMONIALS,
  settings: defaultSiteSettings,
  loaded: false,
  loading: true,
  productsFromDatabase: false,
  testimonialsFromDatabase: false,

  hydrate: (data) =>
    set({
      products: data.products,
      testimonials: data.testimonials,
      settings: data.settings,
      productsFromDatabase: data.productsFromDatabase ?? false,
      testimonialsFromDatabase: data.testimonialsFromDatabase ?? false,
      loaded: true,
      loading: false,
    }),

  setProducts: (products) => set({ products, productsFromDatabase: true }),
  setTestimonials: (testimonials) => set({ testimonials, testimonialsFromDatabase: true }),
  setSettings: (settings) => set({ settings }),
  setLoading: (loading) => set({ loading }),

  getProductById: (id) => get().products.find((p) => p.id === id),
  getProductBySlug: (slug) => get().products.find((p) => p.slug === slug),
}));
