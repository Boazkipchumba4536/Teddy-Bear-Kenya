import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function BestSellers() {
  const best = [...products]
    .filter((p) => p.inStock)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 8);

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="section-label">Most loved</p>
            <h2 className="section-title">Best sellers</h2>
          </div>
          <Link href="/shop?sort=popularity" className="btn-ghost self-start md:self-auto">
            See all best sellers
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {best.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
