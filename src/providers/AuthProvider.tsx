"use client";

import { useCallback, useEffect } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getCurrentUser, getWishlistProductIds } from "@/lib/actions/auth";
import { checkIsAdmin } from "@/lib/actions/admin";
import { AUTH_CHANGED_EVENT } from "@/lib/authEvents";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setIsAdmin = useAuthStore((s) => s.setIsAdmin);
  const setLoaded = useAuthStore((s) => s.setLoaded);
  const clear = useAuthStore((s) => s.clear);
  const setWishlistIds = useWishlistStore((s) => s.setIds);

  const loadSession = useCallback(async () => {
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
        setWishlistIds([]);
      }
    } catch {
      clear();
    } finally {
      setLoaded(true);
    }
  }, [setUser, setIsAdmin, setLoaded, clear, setWishlistIds]);

  useEffect(() => {
    loadSession();

    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "INITIAL_SESSION") return;
      if (event === "TOKEN_REFRESHED") return;
      loadSession();
    });

    const onCustom = () => loadSession();
    window.addEventListener(AUTH_CHANGED_EVENT, onCustom);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener(AUTH_CHANGED_EVENT, onCustom);
    };
  }, [loadSession]);

  return <>{children}</>;
}
