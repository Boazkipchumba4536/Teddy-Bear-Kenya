import { create } from "zustand";
import type { User } from "@/types/order";

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  loaded: boolean;
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setLoaded: (loaded: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  loaded: false,
  setUser: (user) => set({ user }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  setLoaded: (loaded) => set({ loaded }),
  clear: () => set({ user: null, isAdmin: false }),
}));

export { getOrderProgress, orderStatusIndex } from "@/types/order";
