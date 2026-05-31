import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function ExclusiveCollections() {
  const exclusive = products.filter((p) => p.exclusive && p.inStock).slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-blush/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <span className="section-eyebrow">We&apos;re proud to introduce</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-cocoa leading-tight">
            Teddy Bear Kenya
            <span className="block text-gradient mt-1">Exclusive Collections</span>
          </h2>
          <p className="text-cocoa/55 mt-4 max-w-xl mx-auto text-lg">
            Personalized gifts for special occasions — birthdays, love, apologies &amp; just because.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {exclusive.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/shop" className="btn-primary">
            View all teddy bears
          </Link>
        </div>
      </div>
    </section>
  );
}
