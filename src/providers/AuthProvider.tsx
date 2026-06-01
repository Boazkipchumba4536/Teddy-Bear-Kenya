"use client";

import { useCallback, useEffect } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { loadAuthIntoStore } from "@/lib/auth/syncStore";
import { AUTH_CHANGED_EVENT } from "@/lib/authEvents";
import { useAuthStore } from "@/store/authStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setLoaded = useAuthStore((s) => s.setLoaded);

  const loadSession = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoaded(true);
      return;
    }
    try {
      await loadAuthIntoStore();
    } finally {
      setLoaded(true);
    }
  }, [setLoaded]);

  useEffect(() => {
    loadSession();

    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") return;
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
