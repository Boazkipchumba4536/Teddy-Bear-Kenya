import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import StorefrontShell from "@/components/StorefrontShell";
import ToastContainer from "@/components/ToastContainer";
import CatalogProvider from "@/providers/CatalogProvider";
import AuthProvider from "@/providers/AuthProvider";
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
  title: `${site.name} | ${site.tagline}`,
  description: site.description,
  keywords: [
    "teddy bear Kenya",
    "gift shop Nairobi",
    "M-Pesa teddy bear",
    "custom teddy bear Kenya",
    "BearHug KE",
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
      <body className="font-sans min-h-screen flex flex-col pb-16 md:pb-0 bg-cream">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] bg-caramel text-white px-4 py-2 rounded-lg"
        >
          Skip to content
        </a>
        <AuthProvider>
          <CatalogProvider>
            <StorefrontShell>{children}</StorefrontShell>
          </CatalogProvider>
        </AuthProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
