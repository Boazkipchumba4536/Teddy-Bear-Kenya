import Link from "next/link";
import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";
import { Search } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  emptyTitle?: string;
  emptyDescription?: string;
  variant?: "home" | "shop";
}

export default function ProductGrid({
  products,
  emptyTitle = "No bears found",
  emptyDescription = "Try a different occasion or browse our full collection.",
  variant = "shop",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel="Browse all bears"
        actionHref="/shop"
        secondaryLabel="Build custom bear"
        secondaryHref="/custom"
      />
    );
  }

  const gridClass = variant === "home" ? "product-grid-home" : "shop-grid";

  return (
    <div className={gridClass}>
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} variant={variant} />
      ))}
    </div>
  );
}
