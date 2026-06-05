import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toggleWishlistItem } from "@/lib/actions/auth";
import { createDebouncedLocalStorage } from "@/lib/debouncedStorage";

interface WishlistState {
  ids: string[];
  setIds: (ids: string[]) => void;
  toggle: (productId: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],

      setIds: (ids) => set({ ids }),

      toggle: (productId) => {
        const wasIn = get().ids.includes(productId);
        set((state) => ({
          ids: wasIn
            ? state.ids.filter((id) => id !== productId)
            : [...state.ids, productId],
        }));

        // Defer server sync so the heart toggle paints immediately.
        setTimeout(() => {
          void toggleWishlistItem(productId)
            .then((result) => {
              if (result === null) return;
              set((state) => ({
                ids: result
                  ? state.ids.includes(productId)
                    ? state.ids
                    : [...state.ids, productId]
                  : state.ids.filter((id) => id !== productId),
              }));
            })
            .catch(() => {
              set((state) => ({
                ids: wasIn
                  ? [...state.ids, productId]
                  : state.ids.filter((id) => id !== productId),
              }));
            });
        }, 0);
      },
    }),
    {
      name: "bearhug-wishlist-guest",
      storage: createJSONStorage(() => createDebouncedLocalStorage(800)),
    }
  )
);

export function useIsWishlisted(productId: string): boolean {
  return useWishlistStore((s) => s.ids.includes(productId));
}
