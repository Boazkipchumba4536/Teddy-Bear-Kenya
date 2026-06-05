import ProductCardSkeleton from "./ProductCardSkeleton";

interface ProductGridSkeletonProps {
  count?: number;
  columns?: "shop" | "home";
}

export default function ProductGridSkeleton({
  count = 6,
  columns = "shop",
}: ProductGridSkeletonProps) {
  const gridClass =
    columns === "home"
      ? "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
      : "shop-grid md:grid-cols-3";

  return (
    <div className={gridClass} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
