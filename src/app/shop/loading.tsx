import ProductGridSkeleton from "@/components/loading/ProductGridSkeleton";

export default function ShopLoading() {
  return (
    <div className="container-main py-8">
      <div className="h-8 w-48 bg-caramel/10 rounded-lg animate-pulse mb-6" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}
