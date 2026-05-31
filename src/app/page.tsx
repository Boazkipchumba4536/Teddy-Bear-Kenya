import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import FeaturedBento from "@/components/FeaturedBento";
import CategoryStrip from "@/components/CategoryStrip";
import BestSellers from "@/components/BestSellers";
import CustomizationCTA from "@/components/CustomizationCTA";
import TestimonialShowcase from "@/components/TestimonialShowcase";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <FeaturedBento />
      <CategoryStrip />
      <BestSellers />
      <CustomizationCTA />
      <TestimonialShowcase />
    </>
  );
}
