"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import shoppingBagIcon from "@/assets/images/card/shopping_bag.svg";
import commentsIcon from "@/assets/images/products/Comments.svg";
import phoneIcon from "@/assets/images/products/Phone.svg";
import reviewIcon from "@/assets/images/products/Review.svg";
import emptyStarIcon from "@/assets/images/testimonials/EmptyStar.svg";
import starIcon from "@/assets/images/testimonials/Star.svg";
import { useAuth } from "@/context/AuthContext";
import { useBasket } from "@/context/BasketContext";
import { useLanguage } from "@/context/LanguageContext";

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 3V13M3 8H13"
        stroke="#171717"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBackground({ children }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-2xl border border-white bg-[#EBEBEB] p-4">
      {children}
    </span>
  );
}

function formatPrice(value) {
  return `${Number(value).toFixed(2)} ₼`;
}

export default function ProductInfo({ product, phone, onOpenReviews }) {
  const { t } = useLanguage();
  const { has, addProduct } = useBasket();
  const { isLoggedIn, openAuth } = useAuth();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const ratingAverage = Math.round(product.rating?.average ?? 0);
  const ratingCount = product.rating?.count ?? 0;
  const telHref = `tel:${(phone || "+994557300036").replace(/[\s()-]/g, "")}`;
  const inBasket = has(product.id);

  async function handleAddToCart() {
    if (!isLoggedIn) {
      openAuth();
      return;
    }

    setAdding(true);

    try {
      await addProduct(product.id);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      // sorğu alınmasa düymə əvvəlki vəziyyətinə qayıdır
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="flex h-full flex-col justify-between gap-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-base font-normal leading-5 text-foreground">
        <div className="flex items-center gap-2">
          <Image
            src={commentsIcon}
            alt=""
            width={18}
            height={18}
            className="h-[18px] w-[18px]"
          />
          <span>
            {ratingCount} {t("product.reviews")}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }, (_, index) => (
            <Image
              key={index}
              src={index < ratingAverage ? starIcon : emptyStarIcon}
              alt=""
              width={18}
              height={18}
              className="h-[18px] w-[18px]"
            />
          ))}
          <span>({ratingCount})</span>
        </div>
      </div>

      <h1 className="text-2xl font-normal leading-8 text-foreground sm:text-[32px] sm:leading-10">
        {product.title}
      </h1>

      <div className="flex flex-col gap-1">
        {product.discount != null && (
          <p className="text-xl font-[510] leading-7 text-zinc-400 line-through">
            {formatPrice(product.price)}
          </p>
        )}
        <p className="text-2xl font-bold leading-8 text-foreground sm:text-[32px] sm:leading-10">
          {formatPrice(product.final_price ?? product.price)}
        </p>
      </div>

      {product.description && (
        <div
          className="text-sm font-normal leading-5 text-[#333333] [&_a]:text-brand-primary [&_a]:underline [&_p]:mb-2 [&_p:last-child]:mb-0"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      )}

      <button
        type="button"
        disabled={adding}
        onClick={handleAddToCart}
        className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-3xl bg-[var(--background-brand,#755C44)] px-6 text-base font-medium leading-5 text-white transition-colors hover:bg-brand-primary-hover disabled:cursor-default disabled:opacity-60 sm:w-max"
      >
        <Image
          src={shoppingBagIcon}
          alt=""
          width={20}
          height={20}
          className="h-5 w-5 shrink-0"
        />
        {added
          ? t("card.added")
          : inBasket
            ? t("card.inCart")
            : t("card.addToCart")}
      </button>

      <div className="mt-2 flex flex-col gap-3">
        <p className="text-sm font-normal leading-5 text-foreground">
          {t("product.info")}
        </p>

        <button
          type="button"
          onClick={onOpenReviews}
          className="flex w-full cursor-pointer items-center gap-3 rounded-3xl bg-[#F3F3F3] p-4 text-left opacity-100 transition-colors hover:bg-[#ececec]"
        >
          <IconBackground>
            <Image
              src={reviewIcon}
              alt=""
              width={22}
              height={22}
              className="h-[22px] w-[22px]"
            />
          </IconBackground>
          <span className="flex-1">
            <span className="block text-sm font-semibold leading-5 text-foreground">
              {t("product.reviewsTitle")}
            </span>
            <span className="block text-sm font-normal leading-5 text-zinc-500">
              {t("product.clickToView")}
            </span>
          </span>
          <IconBackground>
            <PlusIcon />
          </IconBackground>
        </button>

        <div className="flex w-full items-center gap-3 rounded-3xl bg-[#F3F3F3] p-4 opacity-100">
          <IconBackground>
            <Image
              src={phoneIcon}
              alt=""
              width={22}
              height={22}
              className="h-[22px] w-[22px]"
            />
          </IconBackground>
          <span className="flex-1">
            <span className="block text-sm font-semibold leading-5 text-foreground">
              {t("product.anyQuestions")}
            </span>
            <span className="block text-sm font-normal leading-5 text-zinc-500">
              {t("product.callAndAsk")}
            </span>
          </span>
          <Link
            href={telHref}
            className="rounded-xl bg-[var(--background-brand,#755C44)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover"
          >
            {t("product.call")}
          </Link>
        </div>
      </div>
    </div>
  );
}
