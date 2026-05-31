import Link from "next/link";
import { Sparkles } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import { CATEGORY_IMAGES, IMAGE_SIZES } from "@/lib/images";

export default function CustomizationCTA() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 rounded-4xl overflow-hidden bg-ink shadow-elevated">
          <div className="relative aspect-square lg:aspect-auto lg:min-h-[480px]">
            <ProductImage
              src={CATEGORY_IMAGES.personalised}
              alt="Personalized teddy bear with name embroidery"
              sizes={IMAGE_SIZES.banner}
            />
          </div>
          <div className="flex flex-col justify-center p-10 md:p-14 lg:p-16">
            <div className="inline-flex items-center gap-2 text-champagne text-xs font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-4 h-4" />
              Personalization
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-white leading-tight mb-5">
              Add their name.
              <br />
              Make it unforgettable.
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-md">
              Embroidered or printed name customization from just KSh 500. Perfect
              for birthdays, Valentine&apos;s Day, proposals, and just-because surprises.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/product/name-customisation-charges" className="btn-wine">
                Add name embroidery
              </Link>
              <Link href="/shop?category=personalized" className="btn-outline-white">
                Browse personalized
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
