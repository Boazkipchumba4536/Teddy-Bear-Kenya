import ProductImage from "@/components/ProductImage";
import { IMAGE_SIZES, TESTIMONIAL_IMAGES } from "@/lib/images";
import { site } from "@/lib/site";

export default function ReviewsGallery() {
  return (
    <section className="py-16 md:py-24 bg-blush">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="section-eyebrow">Honest reviews</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cocoa mb-3">
            From Our Customers
          </h2>
          <p className="text-cocoa/55 text-lg">
            With over {site.stats.happyClients} happy clients receiving teddy bears
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {TESTIMONIAL_IMAGES.map((src, i) => (
            <div
              key={src}
              className={`relative rounded-2xl overflow-hidden shadow-card aspect-square ${
                i === 0 ? "sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:min-h-[280px]" : ""
              }`}
            >
              <ProductImage
                src={src}
                alt={`Happy customer ${i + 1}`}
                sizes={IMAGE_SIZES.testimonial}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
