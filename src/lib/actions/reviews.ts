"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProductReview = {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
  isOwn?: boolean;
};

export type ProductRatingSummary = {
  average: number;
  count: number;
  distribution: Record<number, number>;
};

export async function fetchProductReviews(productId: string): Promise<{
  reviews: ProductReview[];
  summary: ProductRatingSummary;
}> {
  const empty: ProductRatingSummary = {
    average: 0,
    count: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("product_reviews")
      .select("id, author_name, rating, comment, created_at, user_id")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error || !data?.length) {
      return { reviews: [], summary: empty };
    }

    const reviews: ProductReview[] = data.map((r) => ({
      id: r.id,
      authorName: r.author_name,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at,
      isOwn: user?.id === r.user_id,
    }));

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    for (const r of reviews) {
      sum += r.rating;
      distribution[r.rating] = (distribution[r.rating] ?? 0) + 1;
    }

    return {
      reviews,
      summary: {
        average: Math.round((sum / reviews.length) * 10) / 10,
        count: reviews.length,
        distribution,
      },
    };
  } catch {
    return { reviews: [], summary: empty };
  }
}

export async function submitProductReview(
  productId: string,
  slug: string,
  data: { rating: number; comment: string }
): Promise<{ ok: boolean; error?: string }> {
  if (data.rating < 1 || data.rating > 5) {
    return { ok: false, error: "Please select a rating from 1 to 5 stars." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Sign in to leave a review." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .maybeSingle();

  const authorName = profile?.name ?? user.email?.split("@")[0] ?? "Customer";

  const { error } = await supabase.from("product_reviews").upsert(
    {
      product_id: productId,
      user_id: user.id,
      author_name: authorName,
      rating: data.rating,
      comment: data.comment.trim().slice(0, 2000),
    },
    { onConflict: "product_id,user_id" }
  );

  if (error) {
    if (error.code === "42P01") {
      return { ok: false, error: "Reviews are not enabled yet. Run migration 004 in Supabase." };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath(`/shop/${slug}`);
  return { ok: true };
}
