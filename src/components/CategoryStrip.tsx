import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import { CATEGORY_IMAGES, IMAGE_SIZES } from "@/lib/images";

const categories = [
  {
    title: "Giant Bears",
    desc: "Up to 160cm",
    href: "/shop?category=giant-teddy-bear",
    image: CATEGORY_IMAGES.giant,
  },
  {
    title: "Big Bears",
    desc: "65cm – 100cm",
    href: "/shop?category=big-teddy-bear",
    image: CATEGORY_IMAGES.big,
  },
  {
    title: "Personalized",
    desc: "Name embroidery",
    href: "/shop?category=personalized",
    image: CATEGORY_IMAGES.personalised,
  },
  {
    title: "Panda Bears",
    desc: "Black & white plush",
    href: "/shop?category=panda",
    image: CATEGORY_IMAGES.panda,
  },
];

export default function CategoryStrip() {
  return (
    <section className="py-20 md:py-28 bg-sand">
      <div className="container-main">
        <div className="text-center mb-14">
          <p className="section-label">Shop by size</p>
          <h2 className="section-title mx-auto">Find your perfect bear</h2>
          <p className="section-subtitle mx-auto mt-4">
            From desk-sized companions to life-size giants — every bear is soft, cuddly, and gift-ready.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative aspect-[3/4] rounded-4xl overflow-hidden bg-white shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-500"
            >
              <ProductImage
                src={cat.image}
                alt={cat.title}
                sizes={IMAGE_SIZES.category}
                className="image-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-xl font-medium text-white mb-1">{cat.title}</h3>
                <p className="text-white/60 text-sm flex items-center justify-between">
                  {cat.desc}
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
