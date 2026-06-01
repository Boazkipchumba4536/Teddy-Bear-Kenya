"use server";

import { createClient } from "@/lib/supabase/server";
import { getSiteOrigin } from "@/lib/siteUrl";
import { normalizePhone } from "@/lib/validators";
import type { User } from "@/types/order";

export async function signUpUser(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        phone: normalizePhone(data.phone),
        role: "customer",
      },
    },
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function signInUser(
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function signOutUser() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

export async function requestPasswordReset(
  email: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const redirectTo = `${getSiteOrigin()}/auth/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updatePassword(
  newPassword: string
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Your reset link may have expired. Request a new one." };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, phone")
    .eq("id", user.id)
    .maybeSingle();

  const meta = user.user_metadata as { name?: string; phone?: string } | undefined;

  return {
    id: user.id,
    email: user.email ?? "",
    name: profile?.name ?? meta?.name ?? user.email?.split("@")[0] ?? "",
    phone: profile?.phone ?? meta?.phone ?? "",
  };
}

export async function updateUserProfile(data: Partial<Pick<User, "name" | "phone">>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("profiles").update(data).eq("id", user.id);
  if (error) throw new Error(error.message);
}

export async function adminSignIn(
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string; isAdmin?: boolean }> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    return { ok: false, error: "This account does not have admin access." };
  }

  return { ok: true, isAdmin: true };
}

export async function getWishlistProductIds(): Promise<string[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase.from("wishlist_items").select("product_id").eq("user_id", user.id);
  return (data ?? []).map((r) => r.product_id);
}

/** `null` when not signed in — client should toggle local guest wishlist. */
export async function toggleWishlistItem(productId: string): Promise<boolean | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: existing } = await supabase
    .from("wishlist_items")
    .select("product_id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    await supabase.from("wishlist_items").delete().eq("user_id", user.id).eq("product_id", productId);
    return false;
  }

  await supabase.from("wishlist_items").insert({ user_id: user.id, product_id: productId });
  return true;
}
