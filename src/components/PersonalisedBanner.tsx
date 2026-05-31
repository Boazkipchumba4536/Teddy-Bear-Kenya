import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { CATEGORY_IMAGES, IMAGE_SIZES } from "@/lib/images";

export default function PersonalisedBanner() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-elevated bg-white">
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[420px]">
            <ProductImage
              src={CATEGORY_IMAGES.personalised}
              alt="Personalised teddy bear gift"
              sizes={IMAGE_SIZES.banner}
            />
          </div>
          <div className="flex flex-col justify-center p-10 md:p-14 lg:p-16 bg-gradient-to-br from-rose-600 to-rose-800 text-white">
            <span className="text-rose-200 text-xs font-bold uppercase tracking-[0.25em] mb-4">
              Personalised gifts
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-5">
              For Someone Special
            </h2>
            <p className="text-white/80 leading-relaxed mb-6 text-lg">
              Fueling special occasions and everyday smiles — birthdays, anniversaries,
              holidays, just-because moments. Create a lasting impression with a teddy
              bear designed just for you.
            </p>
            <p className="text-white/70 text-sm mb-8">
              Check out our Giant Teddy Bears for the perfect birthday gift!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop?category=giant-teddy-bear"
                className="inline-flex rounded-full bg-white text-rose-700 px-8 py-3.5 font-bold hover:bg-rose-50 transition shadow-lg"
              >
                Shop giant bears
              </Link>
              <Link href="/product/name-customisation-charges" className="btn-outline-white">
                Name embroidery
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
