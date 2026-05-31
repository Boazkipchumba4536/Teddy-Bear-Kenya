import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function TrendingProducts() {
  const trending = [...products]
    .filter((p) => p.inStock)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="section-eyebrow">Trending teddy bears</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-cocoa">
              Popular This Week
            </h2>
          </div>
          <Link href="/shop?sort=popularity" className="text-rose-600 font-bold text-sm hover:underline">
            View all trending →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {trending.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
