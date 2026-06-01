"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import {
  loginSchema,
  registerSchema,
  normalizePhone,
  type LoginSchema,
  type RegisterSchema,
} from "@/lib/validators";
import { createClient } from "@/lib/supabase/client";
import { loadAuthIntoStore, friendlyAuthError } from "@/lib/auth/syncStore";
import { notifyAuthChanged } from "@/lib/authEvents";
import { site } from "@/lib/site";

type Tab = "login" | "register";

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackError = searchParams.get("error");
  const [tab, setTab] = useState<Tab>("login");
  const [error, setError] = useState(
    callbackError === "auth_callback"
      ? "Sign-in link expired or was already used. Please try again."
      : ""
  );
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { acceptTerms: false },
  });

  const onLogin = async (data: LoginSchema) => {
    setLoading(true);
    setError("");
    setSuccess("");

    const supabase = createClient();
    const email = data.email.trim().toLowerCase();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: data.password,
    });

    if (signInError) {
      setLoading(false);
      setError(friendlyAuthError(signInError.message));
      return;
    }

    const synced = await loadAuthIntoStore(6);
    notifyAuthChanged();
    setLoading(false);

    if (!synced) {
      setError("Signed in, but we could not load your account. Refresh the page or try again.");
      router.refresh();
      return;
    }

    router.refresh();
    router.push("/account");
  };

  const onRegister = async (data: RegisterSchema) => {
    setLoading(true);
    setError("");
    setSuccess("");

    const supabase = createClient();
    const email = data.email.trim().toLowerCase();

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: data.password,
      options: {
        data: {
          name: data.name.trim(),
          phone: normalizePhone(data.phone),
          role: "customer",
        },
      },
    });

    if (signUpError) {
      setLoading(false);
      setError(friendlyAuthError(signUpError.message));
      return;
    }

    if (!signUpData.session) {
      setLoading(false);
      setSuccess(
        "Account created. If email confirmation is enabled, check your inbox, then sign in."
      );
      setTab("login");
      loginForm.setValue("email", email);
      return;
    }

    const synced = await loadAuthIntoStore(6);
    notifyAuthChanged();
    setLoading(false);

    if (!synced) {
      setSuccess("Account created. Please sign in with your email and password.");
      setTab("login");
      loginForm.setValue("email", email);
      return;
    }

    router.refresh();
    router.push("/account");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">🧸</span>
          <h1 className="font-display text-3xl font-medium text-ink">Welcome to {site.name}</h1>
          <p className="text-ink-muted mt-2 text-sm">{site.tagline}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-card overflow-hidden">
          <div className="flex border-b border-caramel/10">
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTab(t);
                  setError("");
                  setSuccess("");
                }}
                className={`flex-1 py-4 text-sm font-semibold capitalize transition-colors ${
                  tab === t
                    ? "text-caramel border-b-2 border-caramel bg-caramel/5"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {t === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8">
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded-xl bg-green-50 text-green-800 text-sm">{success}</div>
            )}

            {tab === "login" ? (
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <input {...loginForm.register("email")} type="email" className="input-field" placeholder="you@email.com" autoComplete="email" />
                  {loginForm.formState.errors.email && (
                    <p className="text-red-600 text-xs mt-1">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium">Password</label>
                    <Link href="/forgot-password" className="text-xs text-caramel hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <input {...loginForm.register("password")} type="password" className="input-field" placeholder="••••••••" autoComplete="current-password" />
                  {loginForm.formState.errors.password && (
                    <p className="text-red-600 text-xs mt-1">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                </button>
              </form>
            ) : (
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Full Name</label>
                  <input {...registerForm.register("name")} className="input-field" placeholder="Jane Wanjiru" autoComplete="name" />
                  {registerForm.formState.errors.name && (
                    <p className="text-red-600 text-xs mt-1">{registerForm.formState.errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <input {...registerForm.register("email")} type="email" className="input-field" placeholder="you@email.com" autoComplete="email" />
                  {registerForm.formState.errors.email && (
                    <p className="text-red-600 text-xs mt-1">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Phone</label>
                  <input {...registerForm.register("phone")} className="input-field" placeholder="+254 712 345 678" autoComplete="tel" />
                  {registerForm.formState.errors.phone && (
                    <p className="text-red-600 text-xs mt-1">{registerForm.formState.errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Password</label>
                  <input {...registerForm.register("password")} type="password" className="input-field" placeholder="Min. 6 characters" autoComplete="new-password" />
                  {registerForm.formState.errors.password && (
                    <p className="text-red-600 text-xs mt-1">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Confirm Password</label>
                  <input {...registerForm.register("confirmPassword")} type="password" className="input-field" placeholder="Repeat password" autoComplete="new-password" />
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-red-600 text-xs mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                <label className="flex items-start gap-3 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    {...registerForm.register("acceptTerms")}
                    className="mt-1 w-4 h-4 accent-caramel shrink-0"
                  />
                  <span className="text-ink-muted leading-snug">
                    I agree to the{" "}
                    <Link href="/terms" className="text-caramel hover:underline" target="_blank">
                      Terms of Service
                    </Link>
                    ,{" "}
                    <Link href="/privacy" className="text-caramel hover:underline" target="_blank">
                      Privacy Policy
                    </Link>
                    , and{" "}
                    <Link href="/cookies" className="text-caramel hover:underline" target="_blank">
                      Cookie Policy
                    </Link>
                    .
                  </span>
                </label>
                {registerForm.formState.errors.acceptTerms && (
                  <p className="text-red-600 text-xs">{registerForm.formState.errors.acceptTerms.message}</p>
                )}
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                </button>
              </form>
            )}

            {tab === "login" && (
              <p className="text-center text-xs text-ink-light mt-6">
                By signing in you agree to our{" "}
                <Link href="/terms" className="text-caramel hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-caramel hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-ink-muted mt-6">
          <Link href="/shop" className="text-caramel hover:underline">
            Continue as guest →
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
