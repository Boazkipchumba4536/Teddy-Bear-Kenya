"use client";

import { useEffect } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getCurrentUser, getWishlistProductIds } from "@/lib/actions/auth";
import { checkIsAdmin } from "@/lib/actions/admin";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setIsAdmin = useAuthStore((s) => s.setIsAdmin);
  const setLoaded = useAuthStore((s) => s.setLoaded);
  const clear = useAuthStore((s) => s.clear);
  const setWishlistIds = useWishlistStore((s) => s.setIds);

  useEffect(() => {
    async function loadSession() {
      if (!isSupabaseConfigured()) {
        setLoaded(true);
        return;
      }

      try {
        const user = await getCurrentUser();
        setUser(user);
        if (user) {
          const [isAdmin, wishlistIds] = await Promise.all([
            checkIsAdmin(),
            getWishlistProductIds(),
          ]);
          setIsAdmin(isAdmin);
          setWishlistIds(wishlistIds);
        } else {
          setIsAdmin(false);
        }
      } catch {
        clear();
      } finally {
        setLoaded(true);
      }
    }

    loadSession();

    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadSession();
    });
    return () => subscription.unsubscribe();
  }, [setUser, setIsAdmin, setLoaded, clear, setWishlistIds]);

  return <>{children}</>;
}
