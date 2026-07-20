"use client";

import Image from "next/image";
import { useState } from "react";
import emptyStarIcon from "@/assets/images/testimonials/EmptyStar.svg";
import starIcon from "@/assets/images/testimonials/Star.svg";
import ModalShell from "@/components/layout/ModalShell";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { authFetch } from "@/utils/api";

function StarPicker({ value, onSelect }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`${index + 1}`}
          onClick={() => onSelect(index + 1)}
          className="cursor-pointer transition-transform hover:scale-110"
        >
          <Image
            src={index < value ? starIcon : emptyStarIcon}
            alt=""
            width={26}
            height={26}
            style={{ width: 26, height: 26 }}
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductReviewModal({
  productId,
  isOpen,
  onClose,
  onCreated,
}) {
  const { t } = useLanguage();
  const { isLoggedIn, openAuth } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isLoggedIn) {
      onClose();
      openAuth();
      return;
    }

    setError(null);
    setSending(true);

    try {
      const response = await authFetch(`/products/${productId}/reviews`, {
        method: "POST",
        body: JSON.stringify({ rating, comment: comment || null }),
      });

      onCreated?.(response.data);
      setComment("");
      setRating(5);
      onClose();
    } catch (err) {
      const firstError = err.errors ? Object.values(err.errors)[0]?.[0] : null;
      setError(firstError || err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} titleId="review-modal-title">
      <div className="pt-2 text-center">
        <h2
          id="review-modal-title"
          className="text-xl font-semibold text-foreground"
        >
          {t("review.write")}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <StarPicker value={rating} onSelect={setRating} />

        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder={t("review.placeholder")}
          maxLength={2000}
          rows={4}
          className="w-full resize-none rounded-xl border border-[#CCCCCC] bg-white p-3 text-sm leading-5 text-foreground outline-none transition-colors placeholder:text-zinc-400 focus:border-brand-primary"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={sending}
          className="h-12 w-full cursor-pointer rounded-full bg-brand-primary text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover disabled:cursor-default disabled:opacity-60"
        >
          {sending ? t("common.loading") : t("review.submit")}
        </button>
      </form>
    </ModalShell>
  );
}
