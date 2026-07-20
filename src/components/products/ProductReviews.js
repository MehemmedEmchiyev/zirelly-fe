"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import emptyStarIcon from "@/assets/images/testimonials/EmptyStar.svg";
import starIcon from "@/assets/images/testimonials/Star.svg";
import ProductReviewModal from "@/components/products/ProductReviewModal";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/utils/api";
import { formatDate } from "@/utils/blog";

function Stars({ value, size = 16 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <Image
          key={index}
          src={index < value ? starIcon : emptyStarIcon}
          alt=""
          width={size}
          height={size}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}

export default function ProductReviews({ productId }) {
  const { language, t } = useLanguage();
  const { isLoggedIn, openAuth } = useAuth();
  const [reviews, setReviews] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!productId) return;

    let cancelled = false;

    setReviews(null);

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
  }, [productId, language]);

  function handleWriteClick() {
    if (!isLoggedIn) {
      openAuth();
      return;
    }

    setModalOpen(true);
  }

  return (
    <section id="product-reviews" className="w-full scroll-mt-28">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold leading-8 text-foreground sm:text-[32px] sm:leading-10">
          {t("product.reviewsTitle")}
        </h2>

        <button
          type="button"
          onClick={handleWriteClick}
          className="h-11 cursor-pointer rounded-full bg-brand-primary px-6 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover"
        >
          {t("review.write")}
        </button>
      </div>

      {reviews === null && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="h-28 w-full animate-pulse rounded-3xl bg-header-icon-bg"
            />
          ))}
        </div>
      )}

      {reviews !== null && reviews.length === 0 && (
        <p className="rounded-3xl bg-header-icon-bg px-5 py-10 text-center text-sm text-zinc-500">
          {t("review.empty")}
        </p>
      )}

      {reviews !== null && reviews.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="flex flex-col gap-2 rounded-3xl border border-header-border bg-white p-5"
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

              <Stars value={review.rating} />

              {review.comment && (
                <p className="text-sm leading-5 text-[#333333]">
                  {review.comment}
                </p>
              )}
            </article>
          ))}
        </div>
      )}

      <ProductReviewModal
        productId={productId}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(review) => setReviews((prev) => [review, ...(prev ?? [])])}
      />
    </section>
  );
}
