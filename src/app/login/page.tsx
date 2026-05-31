"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mode === "login") {
      if (!login(email, password)) {
        setError("Invalid email or password. Register first if you're new.");
        return;
      }
    } else {
      if (!register(email, password, name, phone)) {
        setError("An account with this email already exists.");
        return;
      }
    }
    router.push("/account");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-center mb-2">
        {mode === "login" ? "Login" : "Register"}
      </h1>
      <p className="text-center text-cocoa/60 mb-8 text-sm">
        {mode === "login"
          ? "Welcome back to Teddy Bear Kenya"
          : "Create your account to track orders"}
      </p>

      <div className="card p-6 md:p-8">
        <div className="flex rounded-full bg-rose-50 p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
              mode === "login" ? "bg-white shadow text-brand-700" : "text-cocoa/60"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
              mode === "register" ? "bg-white shadow text-brand-700" : "text-cocoa/60"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Full name</label>
                <input
                  required
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  required
                  type="tel"
                  className="input-field"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              required
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              required
              type="password"
              minLength={6}
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="btn-primary w-full">
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-cocoa/50 mt-6">
        <Link href="/shop" className="hover:text-rose-600">
          Continue shopping without an account
        </Link>
      </p>
    </div>
  );
}
