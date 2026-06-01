"use client";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getCurrentUser, getWishlistProductIds } from "@/lib/actions/auth";
import { checkIsAdmin } from "@/lib/actions/admin";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Load Supabase session into Zustand; retries while cookies propagate after sign-in. */
export async function loadAuthIntoStore(attempts = 4): Promise<boolean> {
  const { setUser, setIsAdmin, clear, setLoaded } = useAuthStore.getState();
  const setWishlistIds = useWishlistStore.getState().setIds;

  if (!isSupabaseConfigured()) {
    setLoaded(true);
    return false;
  }

  const supabase = createClient();

  for (let i = 0; i < attempts; i++) {
    try {
      await supabase.auth.getSession();
      const user = await getCurrentUser();
      if (user) {
        const [isAdmin, wishlistIds] = await Promise.all([
          checkIsAdmin(),
          getWishlistProductIds(),
        ]);
        setUser(user);
        setIsAdmin(isAdmin);
        setWishlistIds(wishlistIds);
        return true;
      }
    } catch {
      /* retry */
    }
    if (i < attempts - 1) await delay(80 + i * 120);
  }

  clear();
  setWishlistIds([]);
  return false;
}

export function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials") || m.includes("invalid credentials")) {
    return "Incorrect email or password. Check your details or reset your password.";
  }
  if (m.includes("email not confirmed")) {
    return "Please confirm your email first, then sign in again.";
  }
  if (m.includes("too many requests") || m.includes("rate limit")) {
    return "Too many attempts. Wait a minute and try again.";
  }
  if (m.includes("network") || m.includes("fetch")) {
    return "Connection issue. Check your internet and try again.";
  }
  return message;
}
