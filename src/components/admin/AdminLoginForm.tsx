"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { checkIsAdmin } from "@/lib/actions/admin";
import { loadAuthIntoStore, friendlyAuthError } from "@/lib/auth/syncStore";
import { notifyAuthChanged } from "@/lib/authEvents";
import { signOutUser } from "@/lib/actions/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password required"),
});

type FormData = z.infer<typeof schema>;

export default function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");

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

    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      await signOutUser();
      await supabase.auth.signOut();
      setLoading(false);
      setError("This account does not have admin access.");
      return;
    }

    await loadAuthIntoStore(4);
    notifyAuthChanged();
    setLoading(false);
    router.refresh();
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-caramel flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-cream">Admin Panel</h1>
          <p className="text-cream/50 text-sm mt-2">BearHug KE management dashboard</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-cream rounded-2xl p-6 md:p-8 shadow-elevated space-y-4"
        >
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>
          )}
          <div>
            <label className="text-sm font-medium mb-1 block">Admin Email</label>
            <input {...register("email")} type="email" className="input-field" placeholder="admin@bearhugke.co.ke" autoComplete="email" />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Password</label>
            <input {...register("password")} type="password" className="input-field" autoComplete="current-password" />
            {errors.password && (
              <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full bg-ink hover:bg-ink/90">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In to Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
