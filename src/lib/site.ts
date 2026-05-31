/** Business details — update here before go-live */
export const site = {
  name: "Teddy Bear Kenya",
  tagline: "Premium Teddy Bears & Personalized Gifts",
  description:
    "Kenya's trusted teddy bear shop — giant plush bears, personalized embroidery, and countrywide delivery from Nairobi.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://teddybearkenya.co.ke",
  phone: "0712667782",
  phoneDisplay: "+254 712 667 782",
  whatsapp: "254712667782",
  email: "hello@teddybearkenya.co.ke",
  address: {
    line1: "Yala Towers, Biashara Street",
    line2: "4th Floor, Nairobi CBD",
    city: "Nairobi",
    country: "Kenya",
  },
  mpesa: {
    till1: "9466773",
    till2: "8928010",
  },
  instagram: "https://www.instagram.com/teddybearhavenkenya/",
  hours: "Mon–Sat: 9am – 6pm",
  stats: {
    happyClients: "100+",
    delivery: "Countrywide",
  },
} as const;

export const whatsappLink = (message?: string) => {
  const text = encodeURIComponent(
    message ?? "Hi Teddy Bear Kenya! I'd like to order a teddy bear."
  );
  return `https://wa.me/${site.whatsapp}?text=${text}`;
};
