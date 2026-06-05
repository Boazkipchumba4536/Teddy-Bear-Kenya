import type { BearColor, BearSize, Occasion, Product } from "@/types/product";
import { assignUniquePrimaryImages, catalogImage } from "@/lib/productImages";

const img = catalogImage;

export const OCCASIONS: (Occasion | "All")[] = [
  "All",
  "Valentine's",
  "Birthday",
  "Anniversary",
  "Baby Shower",
  "Get Well",
  "Just Because",
];

export const BEAR_SIZES: BearSize[] = ["S", "M", "L", "Giant"];
export { BEAR_COLORS, BEAR_COLOR_HEX, normalizeBearColor } from "@/lib/bearColors";

export const SIZE_PRICES: Record<BearSize, number> = {
  S: 1800,
  M: 2500,
  L: 4000,
  Giant: 8500,
};

const rawProducts = [
  {
    id: "1",
    slug: "honey-love-xl",
    name: "Honey Love XL",
    tagline: "Warm caramel hugs in every stitch",
    description:
      "Our signature caramel-brown teddy with ultra-soft plush fur. Perfect for birthdays, anniversaries, and those just-because moments that deserve something special.",
    careInstructions:
      "Spot clean with mild detergent. Air dry away from direct sunlight. Fluff gently after drying.",
    deliveryInfo:
      "Same-day delivery in Nairobi for orders before 12PM. Standard delivery 2–3 business days nationwide.",
    price: 4000,
    size: "L",
    color: "Brown",
    occasions: ["Birthday", "Anniversary", "Just Because"],
    image: img(3),
    images: [img(3), img(11), img(4), img(15)],
    badge: "Best Seller",
    featured: true,
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    slug: "blush-dream-medium",
    name: "Blush Dream",
    tagline: "Soft pink perfection for every occasion",
    description:
      "A delicate blush-pink teddy bear with satin ribbon bow. Ideal for Valentine's Day, baby showers, and romantic surprises.",
    careInstructions: "Hand wash cold. Do not bleach. Lay flat to dry.",
    deliveryInfo: "Free gift wrapping included. Nairobi same-day available.",
    price: 2500,
    size: "M",
    color: "Pink",
    occasions: ["Valentine's", "Baby Shower", "Birthday"],
    image: img(6),
    images: [img(6), img(9), img(2)],
    badge: "New Arrival",
    featured: true,
    createdAt: "2026-02-01",
  },
  {
    id: "3",
    slug: "cloud-cream-classic",
    name: "Cloud Cream Classic",
    tagline: "Pure white elegance, endlessly huggable",
    description:
      "Premium white plush teddy with embroidered paw pads. A timeless gift for weddings, graduations, and new beginnings.",
    careInstructions: "Dry clean recommended for best results. Store in breathable bag.",
    deliveryInfo: "Delivered in premium gift box. Countrywide shipping available.",
    price: 3300,
    size: "L",
    color: "White",
    occasions: ["Anniversary", "Baby Shower", "Just Because"],
    image: img(12),
    images: [img(12), img(13), img(2)],
    featured: true,
    createdAt: "2026-01-20",
  },
  {
    id: "4",
    slug: "midnight-hug-giant",
    name: "Midnight Hug Giant",
    tagline: "Life-size love that fills the room",
    description:
      "Our show-stopping 180cm giant teddy in rich brown. The ultimate grand gesture for proposals and milestone celebrations.",
    careInstructions: "Professional cleaning recommended due to size.",
    deliveryInfo: "Special delivery scheduling for giant bears. Nairobi metro only for same-day.",
    price: 15000,
    size: "Giant",
    color: "Brown",
    occasions: ["Anniversary", "Birthday"],
    image: img(5),
    images: [img(5), img(16), img(4)],
    badge: "Best Seller",
    featured: true,
    createdAt: "2025-12-10",
  },
  {
    id: "5",
    slug: "pocket-joy-small",
    name: "Pocket Joy",
    tagline: "Small bear, big feelings",
    description:
      "Compact 35cm teddy perfect for desk companions, care packages, and get-well gifts. Soft grey fur with a gentle smile.",
    careInstructions: "Machine wash gentle cycle in pillowcase. Tumble dry low.",
    deliveryInfo: "Fits in standard courier packaging. Fast delivery nationwide.",
    price: 1800,
    size: "S",
    color: "Grey",
    occasions: ["Get Well", "Just Because", "Birthday"],
    image: img(8),
    images: [img(8), img(7)],
    createdAt: "2026-02-15",
  },
  {
    id: "6",
    slug: "love-song-blue",
    name: "Love Song Blue",
    tagline: "Serenade them with softness",
    description:
      "Unique blue teddy with heart embroidery — a standout choice for Valentine's and romantic occasions.",
    careInstructions: "Spot clean only. Keep away from direct heat.",
    deliveryInfo: "Includes complimentary gift card. Same-day Nairobi delivery.",
    price: 4500,
    size: "L",
    color: "Custom",
    occasions: ["Anniversary"],
    image: img(10),
    images: [img(10), img(15), img(3)],
    badge: "New Arrival",
    createdAt: "2026-02-20",
  },
  {
    id: "7",
    slug: "panda-cuddle",
    name: "Panda Cuddle",
    tagline: "Adorable panda plush for panda lovers",
    description:
      "Black and white panda teddy bear — soft, round, and irresistibly cute. A favourite for kids and collectors alike.",
    careInstructions: "Surface wash with damp cloth. Air dry completely.",
    deliveryInfo: "Ships in protective packaging. 2–3 day standard delivery.",
    price: 5500,
    size: "L",
    color: "Custom",
    occasions: ["Birthday", "Just Because"],
    image: img(7),
    images: [img(7), img(8)],
    featured: true,
    createdAt: "2026-01-05",
  },
  {
    id: "8",
    slug: "personalised-name-bear",
    name: "Personalised Name Bear",
    tagline: "Their name, stitched with love",
    description:
      "Custom embroidered name on a premium medium teddy. Choose brown, pink, or cream. Max 12 characters.",
    careInstructions: "Do not iron over embroidery. Gentle hand wash.",
    deliveryInfo: "Allow 1 extra day for personalisation. Gift wrap included.",
    price: 3200,
    size: "M",
    color: "Brown",
    occasions: ["Birthday", "Baby Shower", "Anniversary"],
    image: img(1),
    images: [img(1), img(2), img(6)],
    badge: "Best Seller",
    createdAt: "2025-11-01",
  },
  {
    id: "9",
    slug: "recovery-bear",
    name: "Recovery Bear",
    tagline: "Send healing hugs their way",
    description:
      "A gentle cream teddy with a get-well message card. Perfect for hospital visits and recovery wishes.",
    careInstructions: "Hypoallergenic materials. Machine washable.",
    deliveryInfo: "Express delivery available to hospitals in Nairobi.",
    price: 2200,
    size: "M",
    color: "White",
    occasions: ["Get Well"],
    image: img(2),
    images: [img(2), img(13)],
    createdAt: "2026-01-28",
  },
  {
    id: "10",
    slug: "royal-purple-giant",
    name: "Royal Purple Giant",
    tagline: "Regal, bold, unforgettable",
    description:
      "Stunning purple giant teddy bear for those who want to make a statement. Premium velvet-touch fur.",
    careInstructions: "Professional dry clean only.",
    deliveryInfo: "White-glove delivery for giant bears in Nairobi metro.",
    price: 12000,
    size: "Giant",
    color: "Custom",
    occasions: ["Birthday"],
    image: img(14),
    images: [img(14), img(5)],
    createdAt: "2026-02-10",
  },
  {
    id: "11",
    slug: "everyday-joy",
    name: "Everyday Joy",
    tagline: "Affordable warmth for any day",
    description:
      "Our entry-level teddy in cream and white tones. Soft, cheerful, and perfect for everyday gifting.",
    careInstructions: "Machine wash cold. Air dry.",
    deliveryInfo: "Free delivery on orders above KSh 3,000.",
    price: 1800,
    size: "S",
    color: "White",
    occasions: ["Just Because", "Birthday"],
    image: img(2),
    images: [img(2), img(6)],
    featured: true,
    createdAt: "2026-02-25",
  },
  {
    id: "12",
    slug: "anniversary-duo",
    name: "Anniversary Duo Set",
    tagline: "Two bears, one love story",
    description:
      "Matching pair of medium teddies in brown and blush pink. Includes anniversary gift box and ribbon.",
    careInstructions: "Store together in provided box when not displayed.",
    deliveryInfo: "Premium packaging included. Same-day Nairobi available.",
    price: 5500,
    size: "M",
    color: "Brown",
    occasions: ["Anniversary"],
    image: img(16),
    images: [img(16), img(11), img(4)],
    badge: "New Arrival",
    createdAt: "2026-02-18",
  },
  {
    id: "13",
    slug: "valentine-rose-giant",
    name: "Valentine Rose Giant",
    tagline: "Pink and white grandeur for grand gestures",
    description:
      "A stunning 130cm pink and white giant teddy — the ultimate Valentine's surprise. Premium long-pile fur with satin bow.",
    careInstructions: "Professional cleaning recommended. Store upright.",
    deliveryInfo: "Special handling for giant bears. Nairobi same-day by appointment.",
    price: 9500,
    size: "Giant",
    color: "Pink",
    occasions: ["Valentine's", "Anniversary"],
    image: img(9),
    images: [img(9), img(6), img(16)],
    badge: "Best Seller",
    featured: true,
    createdAt: "2026-01-10",
  },
  {
    id: "14",
    slug: "gentle-embrace-65cm",
    name: "Gentle Embrace 65cm",
    tagline: "Classic white teddy, perfectly sized",
    description:
      "65cm white sitting teddy bear with ultra-soft fur. A timeless gift for weddings, graduations, and new babies.",
    careInstructions: "Spot clean or gentle machine wash in pillowcase.",
    deliveryInfo: "Ships in gift box. Free wrapping on request.",
    price: 3500,
    size: "L",
    color: "White",
    occasions: ["Baby Shower", "Anniversary", "Just Because"],
    image: img(13),
    images: [img(13), img(12), img(2)],
    createdAt: "2026-01-22",
  },
  {
    id: "15",
    slug: "caramel-classic-55cm",
    name: "Caramel Classic 55cm",
    tagline: "Our most-loved everyday hug",
    description:
      "55cm brown teddy with cream paw pads — soft, durable, and perfect for daily cuddles. A BearHug KE favourite.",
    careInstructions: "Machine wash gentle. Air dry and fluff.",
    deliveryInfo: "Same-day Nairobi before 12PM. Countrywide 2–3 days.",
    price: 3300,
    size: "L",
    color: "Brown",
    occasions: ["Birthday", "Just Because", "Get Well"],
    image: img(11),
    images: [img(11), img(3), img(4)],
    badge: "Best Seller",
    featured: true,
    createdAt: "2025-12-20",
  },
  {
    id: "16",
    slug: "proposal-bear-xl",
    name: "Proposal Bear XL",
    tagline: "Pop the question with a giant hug",
    description:
      "100cm brown teddy with 'Hug Me' embroidery — designed for proposals and milestone celebrations. Includes gift card.",
    careInstructions: "Keep dry. Spot clean embroidery area carefully.",
    deliveryInfo: "Express delivery available. We can help coordinate surprise timing.",
    price: 6500,
    size: "L",
    color: "Brown",
    occasions: ["Anniversary"],
    image: img(4),
    images: [img(4), img(3), img(16)],
    featured: true,
    createdAt: "2026-02-05",
  },
  {
    id: "17",
    slug: "baby-shower-bundle",
    name: "Baby Shower Bundle",
    tagline: "Soft cream teddy with welcome card",
    description:
      "Medium cream teddy paired with a 'Welcome Little One' card and ribbon. Perfect for baby showers and gender reveals.",
    careInstructions: "Hypoallergenic materials. Baby-safe stuffing.",
    deliveryInfo: "Gift wrapped and ready to present. Same-day Nairobi.",
    price: 2800,
    size: "M",
    color: "White",
    occasions: ["Baby Shower"],
    image: img(2),
    images: [img(2), img(13), img(6)],
    badge: "New Arrival",
    createdAt: "2026-02-28",
  },
  {
    id: "18",
    slug: "midnight-blue-medium",
    name: "Midnight Blue Medium",
    tagline: "Unique blue plush for standout gifts",
    description:
      "65cm blue sitting teddy bear — a rare colour that stands out. Great for kids, collectors, and unique personalities.",
    careInstructions: "Surface wash only. Avoid direct sunlight to preserve colour.",
    deliveryInfo: "Standard 2–3 day delivery nationwide.",
    price: 3800,
    size: "M",
    color: "Custom",
    occasions: ["Birthday", "Just Because"],
    image: img(8),
    images: [img(8), img(10), img(15)],
    createdAt: "2026-01-18",
  },
  {
    id: "19",
    slug: "lavender-luxe",
    name: "Lavender Luxe",
    tagline: "Purple plush with velvet touch",
    description:
      "Medium purple teddy with luxurious velvet-touch fur. A bold, beautiful choice for those who love colour.",
    careInstructions: "Dry clean preferred to maintain velvet texture.",
    deliveryInfo: "Delivered in premium lavender gift box.",
    price: 4200,
    size: "M",
    color: "Custom",
    occasions: ["Birthday"],
    image: img(5),
    images: [img(14), img(5)],
    createdAt: "2026-02-12",
  },
  {
    id: "20",
    slug: "office-companion-s",
    name: "Office Companion",
    tagline: "Desk-sized cheer for workdays",
    description:
      "Small 30cm grey teddy — the perfect desk companion or secret Santa gift. Soft, neutral, and always smiling.",
    careInstructions: "Wipe clean with damp cloth.",
    deliveryInfo: "Fits standard courier bag. Fast delivery.",
    price: 1500,
    size: "S",
    color: "Grey",
    occasions: ["Just Because", "Get Well"],
    image: img(7),
    images: [img(7), img(8)],
    createdAt: "2026-03-01",
  },
  {
    id: "21",
    slug: "nairobi-nights-brown",
    name: "Nairobi Nights Brown",
    tagline: "Rich brown fur, Nairobi born",
    description:
      "Large brown teddy with deep amber eyes — crafted for warmth and durability. A bestseller across Nairobi.",
    careInstructions: "Brush fur gently after washing. Store in cool dry place.",
    deliveryInfo: "Same-day CBD delivery. Free above KSh 3,000.",
    price: 4800,
    size: "L",
    color: "Brown",
    occasions: ["Birthday", "Anniversary", "Just Because"],
    image: img(15),
    images: [img(15), img(3), img(11)],
    badge: "Best Seller",
    createdAt: "2026-01-08",
  },
  {
    id: "22",
    slug: "giant-collection-showpiece",
    name: "Giant Collection Showpiece",
    tagline: "The centrepiece of any room",
    description:
      "Our premium giant bear collection piece — oversized, luxurious, and unforgettable. For those who go big on love.",
    careInstructions: "Professional maintenance recommended annually.",
    deliveryInfo: "White-glove delivery in Nairobi. Scheduled nationwide.",
    price: 14000,
    size: "Giant",
    color: "Brown",
    occasions: ["Anniversary", "Birthday"],
    image: img(16),
    images: [img(16), img(5), img(9)],
    badge: "New Arrival",
    featured: true,
    createdAt: "2026-02-22",
  },
];

export const products: Product[] = assignUniquePrimaryImages(
  rawProducts.map(
    (p) =>
      ({
        brand: "BearHug KE",
        inStock: true,
        ...p,
      }) as Product
  )
);

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export { getRelatedProducts } from "@/lib/filterProducts";

export function getPriceForSize(basePrice: number, size: BearSize): number {
  const ratio = SIZE_PRICES[size] / SIZE_PRICES.M;
  return Math.round((basePrice / SIZE_PRICES.M) * SIZE_PRICES[size] / ratio) || SIZE_PRICES[size];
}

export { filterProducts } from "@/lib/filterProducts";

export const DEFAULT_TESTIMONIALS = [
  {
    id: "t1",
    name: "Wanjiru",
    city: "Nairobi",
    rating: 5,
    quote: "The giant bear arrived same day! My boyfriend was speechless. Best Valentine's gift ever.",
    occasion: "Valentine's",
  },
  {
    id: "t2",
    name: "James",
    city: "Mombasa",
    rating: 5,
    quote: "Ordered a personalised bear for my daughter's birthday. The embroidery was perfect. Will order again!",
    occasion: "Birthday",
  },
  {
    id: "t3",
    name: "Amina",
    city: "Kisumu",
    rating: 5,
    quote: "M-Pesa payment was so easy. Bear arrived beautifully wrapped. Felt like a luxury boutique experience.",
    occasion: "Anniversary",
  },
  {
    id: "t4",
    name: "David",
    city: "Nairobi",
    rating: 5,
    quote: "Built a custom bear for my wife's anniversary. The embroidery preview was spot on. She cried happy tears!",
    occasion: "Anniversary",
  },
  {
    id: "t5",
    name: "Grace",
    city: "Nakuru",
    rating: 5,
    quote: "Baby shower bundle was adorable. Fast delivery and the gift wrap was gorgeous. Highly recommend BearHug KE.",
    occasion: "Baby Shower",
  },
];

/** @deprecated use DEFAULT_TESTIMONIALS or catalog store */
export const testimonials = DEFAULT_TESTIMONIALS;

export const DEFAULT_PRODUCTS = products;

export const UGC_IMAGES = [2, 3, 4, 5, 6, 7].map((n) => img(n));
