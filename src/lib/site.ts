import { getSiteOrigin } from "@/lib/siteUrl";

/** BearHug KE — business details */
export const site = {
  name: "BearHug KE",
  tagline: "Every bear tells a story.",
  description:
    "Handpicked teddy bears delivered across Kenya. Same-day Nairobi delivery. M-Pesa accepted.",
  url: getSiteOrigin(),
  phone: "0712667782",
  phoneDisplay: "+254 712 667 782",
  whatsapp: "254712667782",
  email: "hello@bearhugke.co.ke",
  instagram: "@BearHugKE",
  instagramUrl: "https://www.instagram.com/bearhugke/",
  address: {
    line1: "Yala Towers, Biashara Street",
    line2: "4th Floor, Nairobi CBD",
    city: "Nairobi",
    country: "Kenya",
  },
  mpesa: {
    till: "9466773",
    till1: "9466773",
    till2: "8928010",
  },
  hours: "Mon–Sat: 9am – 6pm",
  stats: {
    happyClients: "100+",
    delivery: "Countrywide",
  },
  delivery: {
    freeThreshold: 3000,
    standardFee: 300,
    giftWrapFee: 150,
  },
} as const;

export const whatsappLink = (message?: string) => {
  const text = encodeURIComponent(
    message ?? "Hi BearHug KE, I'd like to order a teddy bear…"
  );
  return `https://wa.me/${site.whatsapp}?text=${text}`;
};
