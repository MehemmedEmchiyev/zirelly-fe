"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import shoppingBagIcon from "@/assets/images/card/shopping_bag.svg";
import { useAuth } from "@/context/AuthContext";
import { useBasket } from "@/context/BasketContext";
import { useLanguage } from "@/context/LanguageContext";

function ProductImage({ image, title, originalPrice, inStock, inStockLabel }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#F5F0EB]">
      {image ? (
        <Image
          src={image}
          alt={title}
          fill
          quality={90}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
          className="object-cover object-center"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-24 w-24 rounded-full bg-[#EBE6E0]" />
        </div>
      )}

      {originalPrice && (
        <span className="absolute left-2 top-2 rounded-3xl bg-[var(--background-tertiary,#EBEBEB)] px-2 py-1 text-xs font-normal leading-[18px] text-foreground line-through">
          {originalPrice}
        </span>
      )}

      {inStock && (
        <span className="absolute right-2 top-2 rounded-full bg-[var(--background-positive-subtle,#D7F3E3)] px-2 py-1 text-xs font-normal leading-[18px] text-[#2F7A4E]">
          {inStockLabel}
        </span>
      )}
    </div>
  );
}

function ProductInfo({ title, description }) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-lg font-[590] leading-6 text-foreground">{title}</h3>
      <div
        className="line-clamp-2 text-xs font-[510] leading-[18px] text-zinc-500"
        dangerouslySetInnerHTML={{ __html: description ?? "" }}
      />
    </div>
  );
}

export default function ProductCard({
  productId,
  title,
  description,
  price,
  originalPrice,
  inStock = true,
  image,
  slug,
  onAddToCart,
  className = "",
}) {
  const { t } = useLanguage();
  const { has, addProduct } = useBasket();
  const { isLoggedIn, openAuth } = useAuth();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const inBasket = productId ? has(productId) : false;

  async function handleAddToCart() {
    if (onAddToCart) {
      onAddToCart();
      return;
    }

    if (!productId) return;

    if (!isLoggedIn) {
      openAuth();
      return;
    }

    setAdding(true);

    try {
      await addProduct(productId);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      // sorğu alınmadıqda düymə sadəcə əvvəlki vəziyyətinə qayıdır
    } finally {
      setAdding(false);
    }
  }

  return (
    <article
      className={`flex flex-col gap-5 rounded-[40px] border border-[var(--content-secondary-inverse)] bg-white px-3 py-2 ${className}`}
    >
      {slug ? (
        <Link href={`/products/${slug}`} className="flex flex-col gap-5">
          <ProductImage
            image={image}
            title={title}
            originalPrice={originalPrice}
            inStock={inStock}
            inStockLabel={t("card.inStock")}
          />
          <ProductInfo title={title} description={description} />
        </Link>
      ) : (
        <>
          <ProductImage
            image={image}
            title={title}
            originalPrice={originalPrice}
            inStock={inStock}
            inStockLabel={t("card.inStock")}
          />
          <ProductInfo title={title} description={description} />
        </>
      )}

      <div className="flex items-center justify-between gap-2">
        <span className="rounded-3xl bg-[var(--background-tertiary,#EBEBEB)] px-2 py-1 text-sm font-medium leading-[18px] text-foreground">
          {price}
        </span>

        <button
          type="button"
          disabled={adding}
          onClick={handleAddToCart}
          className="flex cursor-pointer items-center gap-2 rounded-[40px] bg-[var(--background-brand,#755C44)] px-3 py-2 text-sm font-medium leading-[18px] text-white transition-colors hover:bg-brand-primary-hover disabled:cursor-default disabled:opacity-60"
        >
          <Image
            src={shoppingBagIcon}
            alt=""
            width={16}
            height={16}
            className="h-4 w-4 shrink-0"
          />
          {added
            ? t("card.added")
            : inBasket
              ? t("card.inCart")
              : t("card.addToCart")}
        </button>
      </div>
    </article>
  );
}
