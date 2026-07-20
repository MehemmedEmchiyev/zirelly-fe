"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import emptyStarIcon from "@/assets/images/testimonials/EmptyStar.svg";
import starIcon from "@/assets/images/testimonials/Star.svg";
import ModalShell from "@/components/layout/ModalShell";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch, authFetch } from "@/utils/api";
import { formatDate } from "@/utils/blog";

function Stars({ value, size = 18, onSelect }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const star = (
          <Image
            src={index < value ? starIcon : emptyStarIcon}
            alt=""
            width={size}
            height={size}
            style={{ width: size, height: size }}
          />
        );

        if (!onSelect) {
          return <span key={index}>{star}</span>;
        }

        return (
          <button
            key={index}
            type="button"
            aria-label={`${index + 1}`}
            onClick={() => onSelect(index + 1)}
            className="cursor-pointer transition-transform hover:scale-110"
          >
            {star}
          </button>
        );
      })}
    </div>
  );
}

export default function ProductReviews({ productId, isOpen, onClose }) {
  const { language, t } = useLanguage();
  const { isLoggedIn, openAuth } = useAuth();
  const [reviews, setReviews] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isOpen || !productId) return;

    let cancelled = false;

    setReviews(null);
    setStatus(null);

    apiFetch(`/products/${productId}/reviews?per_page=50`, { lang: language })
      .then((response) => {
        if (cancelled) return;
        setReviews(response.data);
      })
      .catch(() => {
        if (cancelled) return;
        setReviews([]);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, productId, language]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isLoggedIn) {
      openAuth();
      return;
    }

    setStatus(null);
    setSending(true);

    try {
      const response = await authFetch(`/products/${productId}/reviews`, {
        method: "POST",
        body: JSON.stringify({ rating, comment: comment || null }),
      });

      setReviews((prev) => [response.data, ...(prev ?? [])]);
      setComment("");
      setStatus({ ok: true, text: t("review.success") });
    } catch (err) {
      const firstError = err.errors ? Object.values(err.errors)[0]?.[0] : null;
      setStatus({ ok: false, text: firstError || err.message });
    } finally {
      setSending(false);
    }
  }

  return (
    <ModalShell
        isOpen={isOpen}
        onClose={onClose}
        titleId="reviews-modal-title"
        maxWidthClass="max-w-[560px]"
      >
        <h2
          id="reviews-modal-title"
          className="pt-2 text-center text-xl font-semibold text-foreground"
        >
          {t("product.reviewsTitle")}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-3 rounded-2xl bg-header-icon-bg p-4"
        >
          <p className="text-sm font-medium text-foreground">
            {t("review.write")}
          </p>

          <Stars value={rating} size={24} onSelect={setRating} />

          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder={t("review.placeholder")}
            maxLength={2000}
            rows={3}
            className="w-full resize-none rounded-xl border border-[#CCCCCC] bg-white p-3 text-sm leading-5 text-foreground outline-none transition-colors placeholder:text-zinc-400 focus:border-brand-primary"
          />

          {status && (
            <p
              className={`text-sm ${status.ok ? "text-[#2F7A4E]" : "text-red-600"}`}
            >
              {status.text}
            </p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="h-11 w-fit cursor-pointer rounded-full bg-brand-primary px-6 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover disabled:cursor-default disabled:opacity-60"
          >
            {sending ? t("common.loading") : t("review.submit")}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-4">
          {reviews === null && (
            <>
              <div className="h-24 w-full animate-pulse rounded-2xl bg-header-icon-bg" />
              <div className="h-24 w-full animate-pulse rounded-2xl bg-header-icon-bg" />
            </>
          )}

          {reviews !== null && reviews.length === 0 && (
            <p className="py-4 text-center text-sm text-zinc-500">
              {t("review.empty")}
            </p>
          )}

          {reviews !== null &&
            reviews.map((review) => (
              <article
                key={review.id}
                className="flex flex-col gap-2 rounded-2xl border border-header-border p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">
                    {review.user
                      ? `${review.user.name} ${review.user.surname ?? ""}`.trim()
                      : "—"}
                  </p>
                  <span className="text-xs text-zinc-500">
                    {formatDate(review.created_at, language)}
                  </span>
                </div>

                <Stars value={review.rating} size={16} />

                {review.comment && (
                  <p className="text-sm leading-5 text-[#333333]">
                    {review.comment}
                  </p>
                )}
              </article>
            ))}
        </div>
    </ModalShell>
  );
}
