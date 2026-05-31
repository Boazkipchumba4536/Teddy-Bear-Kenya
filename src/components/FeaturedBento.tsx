import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import { formatKES } from "@/lib/format";
import { getProductPrice } from "@/data/products";
import { products } from "@/data/products";
import { IMAGE_SIZES } from "@/lib/images";

export default function FeaturedBento() {
  const featured = products.filter((p) => p.featured && p.inStock).slice(0, 5);
  const [hero, ...rest] = featured;

  if (!hero) return null;

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="section-label">Curated selection</p>
            <h2 className="section-title">Featured bears</h2>
          </div>
          <Link href="/shop" className="btn-ghost self-start md:self-auto">
            View all products
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-12 gap-4 md:gap-5">
          {/* Hero product */}
          <Link
            href={`/product/${hero.slug}`}
            className="col-span-2 lg:col-span-7 group relative aspect-[4/5] lg:aspect-auto lg:min-h-[520px] rounded-4xl overflow-hidden bg-sand"
          >
            <ProductImage
              src={hero.image}
              alt={hero.shortName}
              sizes="(max-width: 1024px) 100vw, 58vw"
              priority
              className="image-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-white">
              {hero.exclusive && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-champagne mb-2 block">
                  Exclusive
                </span>
              )}
              <h3 className="font-display text-2xl md:text-3xl font-medium mb-2">{hero.shortName}</h3>
              <p className="text-white/70 text-sm mb-4 line-clamp-2 max-w-md">{hero.description}</p>
              <span className="inline-flex items-center gap-2 font-semibold">
                {formatKES(getProductPrice(hero))}
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </div>
          </Link>

          {/* Side grid */}
          <div className="col-span-2 lg:col-span-5 grid grid-cols-2 gap-4 md:gap-5">
            {rest.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-sand"
              >
                <ProductImage
                  src={product.image}
                  alt={product.shortName}
                  sizes={IMAGE_SIZES.card}
                  className="image-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white text-sm font-semibold line-clamp-1">{product.shortName}</p>
                  <p className="text-white/70 text-xs mt-0.5">{formatKES(getProductPrice(product))}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
