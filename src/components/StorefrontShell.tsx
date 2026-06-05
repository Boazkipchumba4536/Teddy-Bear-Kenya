"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import DeliveryTrustStrip from "@/components/DeliveryTrustStrip";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";

const CartDrawer = dynamic(() => import("@/components/CartDrawer"), { ssr: false });
import WhatsAppFAB from "@/components/WhatsAppFAB";
import MobileNav from "@/components/MobileNav";
import CookieConsent from "@/components/CookieConsent";
import RouteProgressBar from "@/components/loading/RouteProgressBar";
import CategoryTabBar from "@/components/marketplace/CategoryTabBar";

export default function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <RouteProgressBar />
      <DeliveryTrustStrip />
      <Navbar />
      {(pathname?.startsWith("/shop") || pathname === "/custom") && (
        <Suspense fallback={null}>
          <CategoryTabBar />
        </Suspense>
      )}
      <main id="main" className="flex-1 page-enter">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppFAB />
      <CookieConsent />
      <MobileNav />
    </>
  );
}
