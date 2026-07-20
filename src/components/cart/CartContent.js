"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import basketImage from "@/assets/images/basket.png";
import AuthModals from "@/components/layout/AuthModals";
import { useAuth } from "@/context/AuthContext";
import { useBasket } from "@/context/BasketContext";
import { useLanguage } from "@/context/LanguageContext";
import { authFetch } from "@/utils/api";

function formatPrice(value) {
  return `${Number(value).toFixed(2)} ₼`;
}

function MinusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 12H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 6V18M6 12H18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 4H13.5M6.5 2H9.5M3.5 4L4.3 13.1C4.39 14.13 5.25 14.9 6.28 14.9H9.72C10.75 14.9 11.61 14.13 11.7 13.1L12.5 4M6.5 7V11.5M9.5 7V11.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="2.75"
        y="3.75"
        width="18.5"
        height="16.5"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M2.75 8.5H21.25M2.75 12H21.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 17H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CartItem({ item, onQuantityChange, onRemove, busy }) {
  const product = item.product;
  const hasDiscount = product?.discount != null;

  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-5">
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-header-icon-bg">
          {product?.images?.[0]?.url && (
            <Image
              src={product.images[0].url}
              alt={product?.title ?? ""}
              fill
              sizes="96px"
              className="object-cover"
            />
          )}
        </div>

        <div className="flex min-w-0 flex-col">
          <p className="line-clamp-2 text-[14px] leading-5 text-foreground">
            {product?.title}
          </p>

          <div className="flex items-center gap-2 pt-3">
            <span className="text-[14px] leading-5 text-foreground">
              {formatPrice(item.unit_price)}
            </span>

            {hasDiscount && (
              <span className="text-base font-bold leading-5 text-[#666666] line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 rounded-[14px] border border-header-border px-[13px] py-[9px]">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={busy || item.quantity <= 1}
            onClick={() => onQuantityChange(item, item.quantity - 1)}
            className="cursor-pointer text-foreground transition-opacity disabled:cursor-default disabled:opacity-30"
          >
            <MinusIcon />
          </button>

          <span className="w-5 text-center text-[14px] font-medium leading-5 text-foreground">
            {item.quantity}
          </span>

          <button
            type="button"
            aria-label="Increase quantity"
            disabled={busy}
            onClick={() => onQuantityChange(item, item.quantity + 1)}
            className="cursor-pointer text-foreground transition-opacity disabled:cursor-default disabled:opacity-30"
          >
            <PlusIcon />
          </button>
        </div>

        <button
          type="button"
          aria-label="Remove item"
          disabled={busy}
          onClick={() => onRemove(item)}
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[var(--background-tertiary,#EBEBEB)] text-foreground transition-opacity hover:opacity-80 disabled:cursor-default disabled:opacity-50"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

export default function CartContent({ variant = "page" }) {
  const { t } = useLanguage();
  const { refresh: refreshBasketContext } = useBasket();
  const { isLoggedIn, isReady } = useAuth();
  const [basket, setBasket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedOut, setLoggedOut] = useState(false);
  const [busy, setBusy] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState(null);
  const [promoError, setPromoError] = useState(null);
  const [status, setStatus] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);

  const loadBasket = useCallback(async () => {
    try {
      const response = await authFetch("/basket");
      setBasket(response.data);
    } catch (err) {
      if (err.status === 401) {
        setLoggedOut(true);
        setAuthOpen(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;

    if (!isLoggedIn) {
      setLoggedOut(true);
      setAuthOpen(true);
      setLoading(false);
      return;
    }

    setLoggedOut(false);
    setLoading(true);
    loadBasket();
  }, [loadBasket, isLoggedIn, isReady]);

  async function handleQuantityChange(item, quantity) {
    if (quantity < 1) return;
    setBusy(true);

    try {
      await authFetch(`/basket/items/${item.id}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
      });
      await loadBasket();
      setPromo(null);
    } catch {
      setStatus({ ok: false, text: t("cart.error") });
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(item) {
    setBusy(true);

    try {
      await authFetch(`/basket/items/${item.id}`, { method: "DELETE" });
      await loadBasket();
      refreshBasketContext();
      setPromo(null);
    } catch {
      setStatus({ ok: false, text: t("cart.error") });
    } finally {
      setBusy(false);
    }
  }

  async function handleApplyPromo() {
    if (!promoInput.trim()) return;
    setPromoError(null);

    try {
      const response = await authFetch("/promocodes/preview", {
        method: "POST",
        body: JSON.stringify({ code: promoInput.trim() }),
      });
      setPromo(response);
    } catch (err) {
      setPromo(null);
      setPromoError(err.message);
    }
  }

  async function handlePlaceOrder() {
    setBusy(true);
    setStatus(null);

    try {
      await authFetch("/checkout", {
        method: "POST",
        body: JSON.stringify(promo ? { promocode: promo.code } : {}),
      });
      setStatus({ ok: true, text: t("cart.orderSuccess") });
      setPromo(null);
      setPromoInput("");
      await loadBasket();
      refreshBasketContext();
    } catch (err) {
      setStatus({ ok: false, text: err.message || t("cart.error") });
    } finally {
      setBusy(false);
    }
  }

  const items = basket?.items ?? [];
  const subtotal = basket?.summary?.subtotal ?? 0;
  const discount = promo?.discount ?? 0;
  const total = promo?.total ?? subtotal;

  return (
    <div className="flex w-full flex-col items-start gap-6 lg:flex-row">
        <div className="flex w-full min-w-0 flex-col gap-3">
          {variant === "profile" ? (
            <div className="rounded-xl bg-header-icon-bg px-4 py-3">
              <h1 className="text-base font-bold leading-5 text-foreground">
                {t("profile.cartTab")}
              </h1>
            </div>
          ) : (
            <h1 className="text-[32px] font-bold leading-10 text-foreground">
              {t("cart.title")}
            </h1>
          )}

          {loading && (
            <div className="flex flex-col gap-5 rounded-3xl border border-header-border bg-header-icon-bg p-6">
              {Array.from({ length: 2 }, (_, i) => (
                <div key={i} className="h-[136px] w-full animate-pulse rounded-2xl bg-white" />
              ))}
            </div>
          )}

          {!loading && loggedOut && (
            <div className="flex flex-col items-start gap-4 py-6">
              <p className="text-zinc-500">{t("cart.loginRequired")}</p>
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="flex h-11 cursor-pointer items-center rounded-full bg-brand-primary px-5 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover"
              >
                {t("header.login")}
              </button>
            </div>
          )}

          {!loading && !loggedOut && items.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-6 rounded-3xl bg-header-icon-bg px-4 py-12 sm:py-16">
              <Image
                src={basketImage}
                alt=""
                width={180}
                height={180}
                className="h-auto w-[140px] object-contain sm:w-[180px]"
              />

              <div className="flex max-w-[400px] flex-col items-center gap-2 text-center">
                <h2 className="text-xl font-bold leading-7 text-foreground">
                  {status?.ok ? status.text : t("cart.emptyTitle")}
                </h2>
                <p className="text-sm font-normal leading-5 text-[#666666]">
                  {t("cart.emptyText")}
                </p>
              </div>

              <Link
                href="/products"
                className="inline-flex w-max cursor-pointer items-center justify-center rounded-3xl bg-brand-primary px-5 py-3 text-sm font-medium leading-5 text-white transition-colors hover:bg-brand-primary-hover"
              >
                {t("cart.startShopping")}
              </Link>
            </div>
          )}

          {!loading && !loggedOut && items.length > 0 && (
            <div className="flex flex-col gap-5 rounded-3xl border border-header-border bg-header-icon-bg p-4 sm:p-6">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  busy={busy}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </div>

        {!loading && !loggedOut && items.length > 0 && (
          <aside className="flex w-full flex-col gap-3 rounded-2xl border border-header-border bg-header-icon-bg p-[21px] lg:w-[288px] lg:shrink-0">
            <h2 className="text-base font-bold leading-5 text-foreground">
              {t("cart.overview")}
            </h2>

            <div className="flex flex-col gap-4 border-t border-[#CCCCCC] pt-[17px]">
              <div className="flex flex-col gap-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3">
                    <p className="line-clamp-2 min-w-0 text-[12px] leading-[18px] text-foreground">
                      {item.product?.title}
                    </p>

                    <div className="flex shrink-0 flex-col items-end text-right text-[12px] leading-[18px]">
                      {item.product?.discount != null && (
                        <span className="text-[#666666] line-through">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      )}
                      <span className="font-semibold text-foreground">
                        {formatPrice(item.line_total)}
                      </span>
                    </div>
                  </div>
                ))}

                <p className="text-[12px] leading-[18px] text-[#666666]">
                  {basket?.summary?.quantity} {t("cart.items")}
                </p>
              </div>

              {promo && (
                <div className="flex items-center justify-between rounded-[14px] px-4 py-3">
                  <span className="text-[14px] leading-5 text-[#666666]">
                    {t("cart.totalDiscount")}
                  </span>
                  <span className="text-[14px] font-semibold leading-5 text-foreground">
                    - {formatPrice(discount)}
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-semibold leading-[18px] text-[#333333]">
                  {t("cart.promoCode")}
                </span>

                <div className="flex items-end gap-[11px]">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(event) => setPromoInput(event.target.value)}
                    className="h-11 w-[159px] min-w-0 rounded-xl border border-[#CCCCCC] bg-white px-4 text-[14px] leading-5 text-foreground outline-none transition-colors focus:border-brand-primary"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="h-11 min-w-0 flex-1 cursor-pointer rounded-3xl border border-brand-primary text-[14px] font-medium leading-5 text-brand-primary transition-colors hover:bg-brand-primary hover:text-white"
                  >
                    {t("cart.apply")}
                  </button>
                </div>

                {promoError && (
                  <p className="text-[12px] leading-[18px] text-red-600">{promoError}</p>
                )}
              </div>

              <div className="flex flex-col border-t border-[#CCCCCC] pt-[17px]">
                <span className="text-[14px] leading-5 text-[#666666]">
                  {t("cart.totalAmount")}
                </span>
                <span className="text-2xl font-bold leading-8 text-foreground">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {status && !status.ok && (
              <p className="text-[12px] leading-[18px] text-red-600">{status.text}</p>
            )}

            <button
              type="button"
              disabled={busy}
              onClick={handlePlaceOrder}
              className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-3xl bg-brand-primary text-base font-medium leading-5 text-white transition-colors hover:bg-brand-primary-hover disabled:cursor-default disabled:opacity-60"
            >
              <CardIcon />
              {busy ? t("common.loading") : t("cart.placeOrder")}
            </button>
          </aside>
        )}
      <AuthModals isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
