import dynamic from "next/dynamic";
import { Suspense } from "react";
import PageLoader from "@/components/PageLoader";

const ShopClient = dynamic(() => import("@/components/ShopClient"), {
  loading: () => <PageLoader label="Opening the shop…" compact />,
});

export const metadata = {
  title: "Shop Bears | BearHug KE",
  description: "Browse our collection of premium teddy bears for every occasion.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<PageLoader label="Opening the shop…" compact />}>
      <ShopClient />
    </Suspense>
  );
}
