import { headers } from "next/headers";
import { cache } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { adminCountProducts } from "@/lib/actions/admin";

export const metadata = {
  title: "Admin | BearHug KE",
  robots: { index: false, follow: false },
};

const getAdminProductCount = cache(adminCountProducts);

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = headers().get("x-pathname") ?? "";
  let productCount = 0;
  if (!pathname.startsWith("/admin/login")) {
    try {
      productCount = await getAdminProductCount();
    } catch {
      /* auth */
    }
  }

  return <AdminShell productCount={productCount}>{children}</AdminShell>;
}
