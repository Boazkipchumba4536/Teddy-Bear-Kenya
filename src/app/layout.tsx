import type { Metadata } from "next";
import { headers } from "next/headers";
import { Outfit } from "next/font/google";
import "./globals.css";
import StorefrontShell from "@/components/StorefrontShell";
import ToastContainer from "@/components/ToastContainer";
import CatalogProvider from "@/providers/CatalogProvider";
import AuthProvider from "@/providers/AuthProvider";
import { getCachedStorefrontCatalog } from "@/lib/cachedCatalog";
import { site } from "@/lib/site";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = headers().get("x-pathname") ?? "";
  const isAdminRoute = pathname.startsWith("/admin");
  const initialCatalog = isAdminRoute ? undefined : await getCachedStorefrontCatalog();

  return (
    <html lang="en" className={outfit.variable}>
      <body className="font-sans min-h-screen flex flex-col pb-16 md:pb-0 bg-surface text-ink antialiased overflow-x-hidden">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <AuthProvider>
          <CatalogProvider initialCatalog={initialCatalog}>
            <StorefrontShell>{children}</StorefrontShell>
          </CatalogProvider>
        </AuthProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
