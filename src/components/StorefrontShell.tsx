"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import DeliveryTrustStrip from "@/components/DeliveryTrustStrip";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import MobileNav from "@/components/MobileNav";
import StaffAccess from "@/components/StaffAccess";

export default function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <DeliveryTrustStrip />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppFAB />
      <StaffAccess />
      <MobileNav />
    </>
  );
}
