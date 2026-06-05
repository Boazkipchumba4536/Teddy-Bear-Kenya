"use client";

import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import OccasionBentoGrid from "@/components/OccasionBentoGrid";
import ProductGrid from "@/components/ProductGrid";
import { HowItWorks } from "@/components/HowItWorks";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import CustomBearCTA from "@/components/CustomBearCTA";
import TrustBar from "@/components/TrustBar";
import InstagramSection from "@/components/InstagramSection";
import SectionHeader from "@/components/storefront/SectionHeader";
import {
  useCatalogLoaded,
  useCatalogLoading,
  useFilteredProducts,
  useProducts,
} from "@/hooks/useCatalog";
import ProductGridSkeleton from "@/components/loading/ProductGridSkeleton";
import ScrollReveal from "@/components/loading/ScrollReveal";

const HOME_FEATURED = { sort: "featured" as const, minPrice: 0 };

export default function HomePageClient() {
  const catalogLoading = useCatalogLoading();
  const catalogLoaded = useCatalogLoaded();
  const allProducts = useProducts();
  const products = useFilteredProducts(HOME_FEATURED).slice(0, 12);
  const totalCount = allProducts.length;

  return (
    <div className="bg-surface">
      <HeroSection />

      <section className="relative -mt-1 bg-white py-12 md:py-16 lg:py-20">
        <div className="container-main">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
              <SectionHeader
                eyebrow="Our collection"
                title="Choose your bear"
                description={
                  totalCount > 0
                    ? `${totalCount.toLocaleString()} plush bears in stock — every item from our catalog is available to order.`
                    : "Loading our full teddy bear catalog…"
                }
                className="mb-0"
              />
              {totalCount > 0 && (
                <Link href="/shop" className="catalog-count-badge shrink-0 self-start md:self-auto">
                  Browse all {totalCount.toLocaleString()} →
                </Link>
              )}
            </div>
          </ScrollReveal>
          {!catalogLoaded || (catalogLoading && products.length === 0) ? (
            <ProductGridSkeleton count={12} columns="home" />
          ) : (
            <ProductGrid products={products} variant="home" />
          )}
          <ScrollReveal className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/shop" className="btn-primary px-10">
              View entire catalog{totalCount > 0 ? ` (${totalCount.toLocaleString()})` : ""}
            </Link>
            <Link href="/custom" className="btn-ghost">
              Custom bear builder
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <TrustBar />

      <section className="section-pad bg-surface">
        <div className="container-main">
          <ScrollReveal>
            <SectionHeader
              eyebrow="Shop by mood"
              title="Gifts for every occasion"
              description="Valentine's, birthdays, anniversaries, and life-size giant bears."
              action={{ href: "/shop", label: "See all occasions" }}
            />
          </ScrollReveal>
          <OccasionBentoGrid />
        </div>
      </section>

      <HowItWorks />
      <CustomBearCTA />
      <TestimonialCarousel />
      <InstagramSection />
    </div>
  );
}
