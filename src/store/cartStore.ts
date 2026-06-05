import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createDebouncedLocalStorage } from "@/lib/debouncedStorage";
import type { BearColor, BearSize, CartLineItem } from "@/types/product";
import { site } from "@/lib/site";

interface CartState {
  items: CartLineItem[];
  giftWrap: boolean;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
  addItem: (item: Omit<CartLineItem, "id">, options?: { openDrawer?: boolean }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  toggleGiftWrap: () => void;
  clearCart: () => void;
  subtotal: () => number;
  deliveryFee: () => number;
  total: () => number;
  itemCount: () => number;
}

function lineId(productId: string, size: BearSize, color: BearColor, isCustom?: boolean) {
  return `${productId}-${size}-${color}${isCustom ? "-custom" : ""}`;
}

/** Stable selector — avoids re-running itemCount() on unrelated cart fields. */
export const selectCartItemCount = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.quantity, 0);

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      giftWrap: false,
      isOpen: false,

      setOpen: (open) => set({ isOpen: open }),
      toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (item, options) => {
        const id = lineId(item.productId, item.size, item.color, item.isCustom);
        const openDrawer = options?.openDrawer ?? false;
        set((state) => {
          const existing = state.items.find((i) => i.id === id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
              isOpen: openDrawer ? true : state.isOpen,
            };
          }
          return {
            items: [...state.items, { ...item, id }],
            isOpen: openDrawer,
          };
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }));
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      toggleGiftWrap: () => set((s) => ({ giftWrap: !s.giftWrap })),

      clearCart: () => set({ items: [], giftWrap: false }),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      deliveryFee: () => {
        const sub = get().subtotal();
        return sub >= site.delivery.freeThreshold ? 0 : site.delivery.standardFee;
      },

      total: () => {
        const sub = get().subtotal();
        const delivery = get().deliveryFee();
        const wrap = get().giftWrap ? site.delivery.giftWrapFee : 0;
        return sub + delivery + wrap;
      },

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "bearhug-cart",
      partialize: (state) => ({ items: state.items, giftWrap: state.giftWrap }),
      storage: createJSONStorage(() => createDebouncedLocalStorage(800)),
    }
  )
);
