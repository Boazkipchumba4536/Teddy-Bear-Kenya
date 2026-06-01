"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, KeyRound, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { resetPasswordSchema, type ResetPasswordSchema } from "@/lib/validators";
import { updatePassword } from "@/lib/actions/auth";
import { notifyAuthChanged } from "@/lib/authEvents";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const supabase = createClient();

    async function init() {
      const hash = window.location.hash;
      if (hash.includes("access_token") || hash.includes("type=recovery")) {
        const params = new URLSearchParams(hash.replace(/^#/, ""));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          window.history.replaceState(null, "", window.location.pathname);
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) setReady(true);
      setChecking(false);
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
        setChecking(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const onSubmit = async (data: ResetPasswordSchema) => {
    setLoading(true);
    setError("");
    const result = await updatePassword(data.password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? "Could not update password");
      return;
    }
    notifyAuthChanged();
    setDone(true);
    setTimeout(() => router.push("/account"), 2000);
  };

  if (checking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-ink-muted">
        <Loader2 className="w-8 h-8 animate-spin text-caramel" />
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="container-main py-16 max-w-md mx-auto text-center">
        <h1 className="font-display text-2xl font-medium mb-3">Link expired or invalid</h1>
        <p className="text-ink-muted text-sm mb-6">
          Request a new password reset link and open it from your email on this device.
        </p>
        <Link href="/forgot-password" className="btn-primary">
          Request new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="container-main py-16 max-w-md mx-auto text-center">
        <CheckCircle className="w-14 h-14 text-mpesa mx-auto mb-4" />
        <h1 className="font-display text-2xl font-medium mb-2">Password updated</h1>
        <p className="text-ink-muted text-sm">Redirecting to your account…</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-caramel/10 flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-7 h-7 text-caramel" />
          </div>
          <h1 className="font-display text-3xl font-medium text-ink">Set new password</h1>
          <p className="text-ink-muted mt-2 text-sm">Choose a strong password for your account.</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-card space-y-4"
        >
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>
          )}
          <div>
            <label className="text-sm font-medium mb-1 block">New password</label>
            <input
              {...register("password")}
              type="password"
              className="input-field"
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Confirm password</label>
            <input
              {...register("confirmPassword")}
              type="password"
              className="input-field"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
