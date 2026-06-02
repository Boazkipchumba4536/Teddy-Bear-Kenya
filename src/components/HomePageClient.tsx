"use client";

import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import OccasionCategoryGrid from "@/components/OccasionCategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import NewsletterSection from "@/components/NewsletterSection";
import { HowItWorks } from "@/components/HowItWorks";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import InstagramSection from "@/components/InstagramSection";
import CustomBearCTA from "@/components/CustomBearCTA";
import TrustBar from "@/components/TrustBar";
import { useCatalogLoading, useFilteredProducts } from "@/hooks/useCatalog";
import ProductGridSkeleton from "@/components/loading/ProductGridSkeleton";
import FadeIn from "@/components/loading/FadeIn";

export default function HomePageClient() {
  const [occasion, setOccasion] = useState("All");
  const catalogLoading = useCatalogLoading();
  const products = useFilteredProducts({ occasion, sort: "featured" }).slice(0, 8);

  return (
    <>
      <HeroSection />
      <TrustBar />
      <section className="py-10 bg-white border-y border-market-border">
        <div className="container-main">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-market-dark mb-2">
              Shop by Occasion
            </h2>
            <p className="text-market-muted text-sm mb-6">
              Valentine&apos;s — red &amp; pink bears. Birthday, anniversary, and size filters on the shop page.
            </p>
            <OccasionCategoryGrid
              selected={occasion}
              onSelect={setOccasion}
              mode="filter"
            />
          </FadeIn>
          <div className="mt-10">
            {catalogLoading ? (
              <ProductGridSkeleton count={8} columns="home" />
            ) : (
              <FadeIn delay={0.08}>
                <ProductGrid products={products} />
              </FadeIn>
            )}
          </div>
        </div>
      </section>
      <HowItWorks />
      <CustomBearCTA />
      <TestimonialCarousel />
      <InstagramSection />
      <NewsletterSection />
    </>
  );
}
