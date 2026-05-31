import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import MobileNavBar from "@/components/MobileNavBar";
import { site } from "@/lib/site";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: `${site.name} | Premium Teddy Bears & Personalized Gifts`,
  description: site.description,
  keywords: [
    "teddy bear Kenya",
    "giant teddy bear Nairobi",
    "personalized teddy bear",
    "big teddy bear Kenya",
    "teddy bear delivery Kenya",
  ],
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
    locale: "en_KE",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <head>
        <link rel="preconnect" href="https://teddybearhaven.co.ke" />
        <link rel="dns-prefetch" href="https://teddybearhaven.co.ke" />
      </head>
      <body className="font-sans min-h-screen flex flex-col pb-16 md:pb-0">
        <StoreProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] bg-wine text-white px-4 py-2 rounded-lg"
          >
            Skip to content
          </a>
          <AnnouncementBar />
          <Header />
          <main id="main" className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppFloat />
          <MobileNavBar />
        </StoreProvider>
      </body>
    </html>
  );
}
