import type { MetadataRoute } from "next";
import { fetchProducts } from "@/lib/actions/catalog";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");
  const catalog = await fetchProducts();
  const productPages = catalog.map((p) => ({
    url: `${base}/shop/${p.slug}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/custom`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/track`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/account`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/wishlist`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/orders`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/forgot-password`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/cookies`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    ...productPages,
  ];
}
