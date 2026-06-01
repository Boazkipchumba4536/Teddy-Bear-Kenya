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
        const toggleLocal = () =>
          set((state) => ({
            ids: state.ids.includes(productId)
              ? state.ids.filter((id) => id !== productId)
              : [...state.ids, productId],
          }));

        try {
          const result = await toggleWishlistItem(productId);
          if (result === null) {
            toggleLocal();
            return;
          }
          set((state) => ({
            ids: result
              ? [...state.ids, productId]
              : state.ids.filter((id) => id !== productId),
          }));
        } catch {
          toggleLocal();
        }
      },

      has: (productId) => get().ids.includes(productId),
    }),
    { name: "bearhug-wishlist-guest" }
  )
);
