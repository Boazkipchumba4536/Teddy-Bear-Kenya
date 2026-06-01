import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getSiteOrigin } from "@/lib/siteUrl";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";
  const origin = getSiteOrigin();

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/account";
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback`);
}
