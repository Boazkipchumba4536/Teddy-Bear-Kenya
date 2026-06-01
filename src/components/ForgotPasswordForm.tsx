"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordSchema } from "@/lib/validators";
import { requestPasswordReset } from "@/lib/actions/auth";
import { site } from "@/lib/site";

export default function ForgotPasswordForm() {
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setLoading(true);
    setError("");
    const result = await requestPasswordReset(data.email);
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? "Could not send reset email");
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-caramel mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-caramel/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-caramel" />
          </div>
          <h1 className="font-display text-3xl font-medium text-ink">Forgot password?</h1>
          <p className="text-ink-muted mt-2 text-sm">
            Enter your email and we&apos;ll send a link to reset your password.
          </p>
        </div>

        {sent ? (
          <div className="bg-white rounded-3xl p-8 shadow-card text-center">
            <CheckCircle className="w-12 h-12 text-mpesa mx-auto mb-4" />
            <h2 className="font-semibold text-lg mb-2">Check your inbox</h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              If an account exists for that email, you&apos;ll receive a reset link from{" "}
              {site.name}. The link expires after a short time — check spam if you don&apos;t see
              it.
            </p>
            <Link href="/login" className="btn-primary inline-flex mt-6">
              Return to sign in
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-3xl p-6 md:p-8 shadow-card space-y-4"
          >
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>
            )}
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <input
                {...register("email")}
                type="email"
                className="input-field"
                placeholder="you@email.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send reset link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
