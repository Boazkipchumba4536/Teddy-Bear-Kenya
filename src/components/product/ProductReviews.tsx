"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Star } from "lucide-react";
import {
  fetchProductReviews,
  submitProductReview,
  type ProductRatingSummary,
  type ProductReview,
} from "@/lib/actions/reviews";
import { useAuthStore } from "@/store/authStore";

interface ProductReviewsProps {
  productId: string;
  slug: string;
}

function StarRow({
  value,
  onChange,
  readonly,
}: {
  value: number;
  onChange?: (n: number) => void;
  readonly?: boolean;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(n)}
          className={readonly ? "cursor-default" : "hover:scale-110 transition-transform"}
          aria-label={`${n} stars`}
        >
          <Star
            className={`w-5 h-5 ${
              n <= value ? "fill-market-orange text-market-orange" : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ productId, slug }: ProductReviewsProps) {
  const user = useAuthStore((s) => s.user);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [summary, setSummary] = useState<ProductRatingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const load = () => {
    setLoading(true);
    fetchProductReviews(productId)
      .then(({ reviews: r, summary: s }) => {
        setReviews(r);
        setSummary(s);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [productId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    const result = await submitProductReview(productId, slug, { rating, comment });
    setSubmitting(false);
    if (!result.ok) {
      setMessage(result.error ?? "Could not submit review");
      return;
    }
    setComment("");
    setMessage("Thank you! Your review was saved.");
    load();
  };

  return (
    <section className="mt-10 border-t border-market-border pt-8" id="reviews">
      <h2 className="text-lg font-bold text-market-dark mb-4">Customer Reviews</h2>

      {loading ? (
        <div className="flex items-center gap-2 text-market-muted py-8">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading reviews…
        </div>
      ) : (
        <>
          {summary && summary.count > 0 ? (
            <div className="flex flex-wrap items-center gap-6 mb-6 p-4 bg-market-gray rounded-lg border border-market-border">
              <div className="text-center">
                <p className="text-3xl font-bold text-market-orange">{summary.average}</p>
                <StarRow value={Math.round(summary.average)} readonly />
                <p className="text-xs text-market-muted mt-1">{summary.count} review(s)</p>
              </div>
              <div className="flex-1 min-w-[200px] space-y-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = summary.distribution[star] ?? 0;
                  const pct = summary.count ? (count / summary.count) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-8 text-market-muted">{star} ★</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-market-orange rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 text-market-muted">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-sm text-market-muted mb-6">No reviews yet. Be the first to rate this bear!</p>
          )}

          {user ? (
            <form
              onSubmit={onSubmit}
              className="mb-8 p-4 bg-white border border-market-border rounded-lg"
            >
              <p className="text-sm font-semibold text-market-dark mb-2">Write a review</p>
              <StarRow value={rating} onChange={setRating} />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="market-input mt-3 resize-none"
                placeholder="Share your experience with this teddy bear…"
                required
              />
              {message && (
                <p
                  className={`text-sm mt-2 ${message.includes("Thank") ? "text-market-green" : "text-red-600"}`}
                >
                  {message}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="mt-3 bg-market-orange text-white font-bold text-sm px-6 py-2.5 rounded hover:bg-market-orange-dark disabled:opacity-50"
              >
                {submitting ? "Submitting…" : "Submit Review"}
              </button>
            </form>
          ) : (
            <p className="text-sm text-market-muted mb-8">
              <Link href="/login" className="text-market-orange font-semibold hover:underline">
                Sign in
              </Link>{" "}
              to leave a rating and review.
            </p>
          )}

          <ul className="space-y-4">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="border-b border-market-border pb-4 last:border-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm text-market-dark">{r.authorName}</p>
                  <span className="text-xs text-market-muted">
                    {new Date(r.createdAt).toLocaleDateString("en-KE")}
                  </span>
                </div>
                <StarRow value={r.rating} readonly />
                {r.comment && (
                  <p className="text-sm text-market-text mt-2 leading-relaxed">{r.comment}</p>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
