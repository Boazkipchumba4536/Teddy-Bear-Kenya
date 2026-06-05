import { notFound } from "next/navigation";
import { fetchProductBySlug, fetchProducts } from "@/lib/actions/catalog";
import { getProductDisplayImage } from "@/lib/productDisplayImage";
import ProductPageClient from "@/components/ProductPageClient";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.slice(0, 48).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const product = await fetchProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found | BearHug KE" };
  const ogImage = getProductDisplayImage(product, "detail");
  return {
    title: `${product.name} | BearHug KE`,
    description: product.tagline,
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: [{ url: ogImage }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await fetchProductBySlug(params.slug);
  if (!product) notFound();
  return <ProductPageClient product={product} />;
}
