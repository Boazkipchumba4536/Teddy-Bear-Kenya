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
              n <= value ? "fill-caramel text-caramel" : "text-ink/20"
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
    <section className="mt-10 border-t border-caramel/10 pt-8" id="reviews">
      <h2 className="font-display text-xl font-medium text-ink mb-4">Customer Reviews</h2>

      {loading ? (
        <div className="flex items-center gap-2 text-ink-muted py-8">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading reviews…
        </div>
      ) : (
        <>
          {summary && summary.count > 0 ? (
            <div className="flex flex-wrap items-center gap-6 mb-6 p-5 bg-cream/50 rounded-2xl border border-caramel/10">
              <div className="text-center">
                <p className="text-3xl font-display font-medium text-caramel">{summary.average}</p>
                <StarRow value={Math.round(summary.average)} readonly />
                <p className="text-xs text-ink-light mt-1">{summary.count} review(s)</p>
              </div>
              <div className="flex-1 min-w-[200px] space-y-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = summary.distribution[star] ?? 0;
                  const pct = summary.count ? (count / summary.count) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-8 text-ink-light">{star} ★</span>
                      <div className="flex-1 h-2 bg-blush/40 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-caramel rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 text-ink-light">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-muted mb-6">No reviews yet. Be the first to rate this bear!</p>
          )}

          {user ? (
            <form
              onSubmit={onSubmit}
              className="mb-8 p-5 shop-panel"
            >
              <p className="text-sm font-semibold text-ink mb-2">Write a review</p>
              <StarRow value={rating} onChange={setRating} />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="input-field mt-3 resize-none"
                placeholder="Share your experience with this teddy bear…"
                required
              />
              {message && (
                <p
                  className={`text-sm mt-2 ${message.includes("Thank") ? "text-mpesa" : "text-terracotta"}`}
                >
                  {message}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="mt-3 btn-primary min-h-0 disabled:opacity-50"
              >
                {submitting ? "Submitting…" : "Submit Review"}
              </button>
            </form>
          ) : (
            <p className="text-sm text-ink-muted mb-8">
              <Link href="/login" className="text-caramel font-semibold hover:underline">
                Sign in
              </Link>{" "}
              to leave a rating and review.
            </p>
          )}

          <ul className="space-y-4">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="border-b border-caramel/10 pb-4 last:border-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm text-ink">{r.authorName}</p>
                  <span className="text-xs text-ink-light">
                    {new Date(r.createdAt).toLocaleDateString("en-KE")}
                  </span>
                </div>
                <StarRow value={r.rating} readonly />
                {r.comment && (
                  <p className="text-sm text-ink-muted mt-2 leading-relaxed">{r.comment}</p>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
