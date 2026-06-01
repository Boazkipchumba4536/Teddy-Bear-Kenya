import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toggleWishlistItem } from "@/lib/actions/auth";

interface WishlistState {
  ids: string[];
  setIds: (ids: string[]) => void;
  toggle: (productId: string) => Promise<void>;
  has: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],

      setIds: (ids) => set({ ids }),

      toggle: async (productId) => {
        try {
          const added = await toggleWishlistItem(productId);
          set((state) => ({
            ids: added
              ? [...state.ids, productId]
              : state.ids.filter((id) => id !== productId),
          }));
        } catch {
          set((state) => ({
            ids: state.ids.includes(productId)
              ? state.ids.filter((id) => id !== productId)
              : [...state.ids, productId],
          }));
        }
      },

      has: (productId) => get().ids.includes(productId),
    }),
    { name: "bearhug-wishlist-guest" }
  )
);
