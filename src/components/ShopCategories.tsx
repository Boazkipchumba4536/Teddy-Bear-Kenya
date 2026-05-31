import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { CATEGORY_IMAGES, IMAGE_SIZES } from "@/lib/images";

const shopCategories = [
  {
    title: "Giant Teddy Bears",
    subtitle: "Up to 140cm life-size",
    href: "/shop?category=giant-teddy-bear",
    image: CATEGORY_IMAGES.giant,
  },
  {
    title: "Big Teddy Bears",
    subtitle: "65cm – 100cm cuddles",
    href: "/shop?category=big-teddy-bear",
    image: CATEGORY_IMAGES.big,
  },
  {
    title: "Personalized",
    subtitle: "Name embroidery from KSh 500",
    href: "/shop?category=personalized",
    image: CATEGORY_IMAGES.personalised,
  },
  {
    title: "Panda Bears",
    subtitle: "Unique black & white plush",
    href: "/shop?category=panda",
    image: CATEGORY_IMAGES.panda,
  },
];

export default function ShopCategories() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="section-eyebrow">Passion for teddy bears</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cocoa">
            Shop By Categories
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {shopCategories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-500"
            >
              <ProductImage
                src={cat.image}
                alt={cat.title}
                sizes={IMAGE_SIZES.category}
                className="transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa/85 via-cocoa/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="font-display text-xl font-bold group-hover:text-rose-200 transition">
                  {cat.title}
                </h3>
                <p className="text-white/70 text-sm mt-1">{cat.subtitle}</p>
                <span className="inline-block mt-3 text-xs font-bold uppercase tracking-wider text-rose-200 opacity-0 group-hover:opacity-100 transition-opacity">
                  Shop now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
