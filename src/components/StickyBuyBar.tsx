"use client";

import { ShoppingBag } from "lucide-react";
import { formatKES } from "@/lib/format";
import { getProductPrice } from "@/data/products";
import type { Product } from "@/lib/types";
import { useStore } from "@/context/StoreContext";

interface Props {
  product: Product;
  variantId?: string;
  quantity: number;
}

export default function StickyBuyBar({ product, variantId, quantity }: Props) {
  const { addToCart } = useStore();
  const price = getProductPrice(product, variantId) * quantity;

  if (!product.inStock) return null;

  return (
    <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-2xl border-t border-ink/5 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] safe-bottom">
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-ink-muted truncate">{product.shortName}</p>
          <p className="font-semibold text-ink text-lg">{formatKES(price)}</p>
        </div>
        <button
          type="button"
          onClick={() =>
            addToCart({
              productId: product.id,
              variantId,
              quantity,
            })
          }
          className="btn-primary py-3 px-6 shrink-0"
        >
          <ShoppingBag className="w-4 h-4" />
          Add to cart
        </button>
      </div>
    </div>
  );
}
