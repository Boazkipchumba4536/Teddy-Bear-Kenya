"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import {
  loginSchema,
  registerSchema,
  type LoginSchema,
  type RegisterSchema,
} from "@/lib/validators";
import { signInUser, signUpUser } from "@/lib/actions/auth";
import { site } from "@/lib/site";

type Tab = "login" | "register";

export default function AuthForm() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onLogin = async (data: LoginSchema) => {
    setLoading(true);
    setError("");
    const result = await signInUser(data.email, data.password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? "Login failed");
      return;
    }
    router.push("/account");
    router.refresh();
  };

  const onRegister = async (data: RegisterSchema) => {
    setLoading(true);
    setError("");
    const result = await signUpUser({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
    });
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? "Registration failed");
      return;
    }
    router.push("/account");
    router.refresh();
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

            {tab === "login" ? (
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <input {...loginForm.register("email")} type="email" className="input-field" placeholder="you@email.com" />
                  {loginForm.formState.errors.email && (
                    <p className="text-red-600 text-xs mt-1">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Password</label>
                  <input {...loginForm.register("password")} type="password" className="input-field" placeholder="••••••••" />
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
                  <input {...registerForm.register("name")} className="input-field" placeholder="Jane Wanjiru" />
                  {registerForm.formState.errors.name && (
                    <p className="text-red-600 text-xs mt-1">{registerForm.formState.errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <input {...registerForm.register("email")} type="email" className="input-field" placeholder="you@email.com" />
                  {registerForm.formState.errors.email && (
                    <p className="text-red-600 text-xs mt-1">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Phone</label>
                  <input {...registerForm.register("phone")} className="input-field" placeholder="+254 712 345 678" />
                  {registerForm.formState.errors.phone && (
                    <p className="text-red-600 text-xs mt-1">{registerForm.formState.errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Password</label>
                  <input {...registerForm.register("password")} type="password" className="input-field" placeholder="Min. 6 characters" />
                  {registerForm.formState.errors.password && (
                    <p className="text-red-600 text-xs mt-1">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Confirm Password</label>
                  <input {...registerForm.register("confirmPassword")} type="password" className="input-field" placeholder="Repeat password" />
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-red-600 text-xs mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                </button>
              </form>
            )}

            <p className="text-center text-xs text-ink-light mt-6">
              By continuing, you agree to our terms of service and privacy policy.
            </p>
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
