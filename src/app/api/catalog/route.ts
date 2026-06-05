import { NextResponse } from "next/server";
import { fetchCatalogBundle } from "@/lib/actions/catalog";
import { slimCatalogBundle } from "@/lib/catalogCache";

export const revalidate = 300;

export async function GET() {
  try {
    const bundle = await fetchCatalogBundle();
    return NextResponse.json(slimCatalogBundle(bundle), {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Catalog unavailable" }, { status: 503 });
  }
}
