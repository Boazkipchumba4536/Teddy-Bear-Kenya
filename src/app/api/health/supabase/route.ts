import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** GET /api/health/supabase — use on Vercel to verify env vars and DB (no secrets returned). */
export async function GET() {
  const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasAnon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const hasService = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!hasUrl || !hasAnon) {
    return NextResponse.json({
      ok: false,
      error: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY on this deployment.",
      env: { hasUrl, hasAnon, hasService },
    });
  }

  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({
        ok: false,
        error: error.message,
        hint:
          error.message.includes("schema cache") || error.code === "PGRST205"
            ? "Run supabase/migrations/001_initial_schema.sql in the Supabase SQL Editor."
            : "Check API keys match this project (Settings → API). Redeploy Vercel after updating env vars.",
        env: { hasUrl, hasAnon, hasService },
      });
    }

    return NextResponse.json({
      ok: true,
      productCount: count ?? 0,
      env: { hasUrl, hasAnon, hasService },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Supabase connection failed";
    return NextResponse.json({
      ok: false,
      error: message,
      hint: "Invalid API key or wrong project URL — copy fresh keys from Supabase → Settings → API, then redeploy.",
      env: { hasUrl, hasAnon, hasService },
    });
  }
}
