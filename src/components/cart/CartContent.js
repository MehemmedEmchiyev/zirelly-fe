"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import basketImage from "@/assets/images/card/shopping_bag.svg";
import { useAuth } from "@/context/AuthContext";
import { useBasket } from "@/context/BasketContext";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch, authFetch } from "@/utils/api";
import DeliveryAddressFields from "@/components/common/DeliveryAddressFields";
import {
  composeDeliveryAddress,
  parseDeliveryAddress,
} from "@/constants/delivery-locations";

const EMPTY_ADDRESS = {
  city: "",
  district: "",
  street: "",
  building: "",
  apartment: "",
  note: "",
};

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
            id={`btn-cart-decrease-${item.id}`}
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
            id={`btn-cart-increase-${item.id}`}
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
          id={`btn-cart-remove-${item.id}`}
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
  const { isLoggedIn, isReady, openAuth } = useAuth();
  const [basket, setBasket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedOut, setLoggedOut] = useState(false);
  const [busy, setBusy] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState(null);
  const [promoError, setPromoError] = useState(null);
  const [status, setStatus] = useState(null);
  const [locations, setLocations] = useState(null);
  const [addr, setAddr] = useState(EMPTY_ADDRESS);
  const [savedAddr, setSavedAddr] = useState(null);
  const [addrMode, setAddrMode] = useState("custom");
  const [addrErrors, setAddrErrors] = useState({});

  const bakuName = locations?.baku ?? "Bakı";
  const isBaku = addr.city === bakuName;
  const addrCity = addr.city;

  const loadBasket = useCallback(async () => {
    try {
      const response = await authFetch("/basket");
      setBasket(response.data);
    } catch (err) {
      if (err.status === 401) {
        setLoggedOut(true);
        openAuth();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;

    if (!isLoggedIn) {
      setLoggedOut(true);
      openAuth();
      setLoading(false);
      return;
    }

    setLoggedOut(false);
    setLoading(true);
    loadBasket();

    // Qeydiyyatda yazılan ünvan default gəlir — istifadəçi istəsə dəyişir
    authFetch("/auth/me")
      .then((response) => {
        const u = response.data;
        if (!u) return;

        // Struktur sahələr yoxdursa (köhnə hesablar), vahid sətirdən çıxarılır
        const parsed =
          !u.address_city && u.address ? parseDeliveryAddress(u.address) : null;

        const saved = {
          city: u.address_city || parsed?.city || "",
          district: u.address_district || parsed?.district || "",
          street: u.address_street || parsed?.street || "",
          building: u.address_building || parsed?.building || "",
          apartment: u.address_apartment || parsed?.apartment || "",
          note: u.address_note || "",
        };

        const complete =
          saved.city &&
          saved.street &&
          saved.building &&
          (saved.city !== "Bakı" || saved.district);

        if (!complete) return;

        setSavedAddr(saved);
        setAddr(saved);
        setAddrMode("saved");
      })
      .catch(() => {});
  }, [loadBasket, isLoggedIn, isReady]);

  useEffect(() => {
    apiFetch("/delivery-locations")
      .then(setLocations)
      .catch(() => setLocations(null));
  }, []);

  async function handleQuantityChange(item, quantity) {
    if (quantity < 1) return;
    setBusy(true);

    try {
      await authFetch(`/basket/items/${item.id}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
      });
      await loadBasket();
      refreshBasketContext();
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
    const errors = {};
    if (!addr.city) errors.city = true;
    if (isBaku && !addr.district) errors.district = true;
    if (!addr.street.trim()) errors.street = true;
    if (!addr.building.trim()) errors.building = true;

    // Qeydiyyat ünvanı seçilibsə, amma natamamdırsa, inputları açıb göstər
    if (Object.keys(errors).length > 0) setAddrMode("custom");

    setAddrErrors(errors);

    if (Object.keys(errors).length > 0) {
      setStatus({ ok: false, text: t("cart.addressFillRequired") });
      return;
    }

    setBusy(true);
    setStatus(null);

    try {
      const response = await authFetch("/checkout", {
        method: "POST",
        body: JSON.stringify({
          address_city: addr.city,
          address_district: isBaku ? addr.district : null,
          address_street: addr.street.trim(),
          address_building: addr.building.trim(),
          address_apartment: addr.apartment.trim() || null,
          address_note: addr.note.trim() || null,
          ...(promo ? { promocode: promo.code } : {}),
        }),
      });

      if (response?.payment_url) {
        setStatus({ ok: true, text: t("payment.redirecting") });
        window.location.assign(response.payment_url);
        return;
      }

      setStatus({ ok: true, text: t("cart.orderSuccess") });
      setPromo(null);
      setPromoInput("");
      await loadBasket();
      refreshBasketContext();
      setBusy(false);
    } catch (err) {
      setStatus({ ok: false, text: err.message || t("cart.error") });
      setBusy(false);
    }
  }

  const items = basket?.items ?? [];
  const subtotal = basket?.summary?.subtotal ?? 0;
  const discount = promo?.discount ?? 0;
  const goodsTotal = promo?.total ?? subtotal;

  // Çatdırılma haqqı seçilmiş şəhərə və malların yekununa görə (backend ilə eyni qayda)
  const fees = locations?.fees;
  let deliveryFee = null;
  if (addrCity && fees) {
    if (addrCity === (locations?.baku ?? "Bakı")) {
      deliveryFee = goodsTotal >= fees.baku_free_threshold ? 0 : fees.baku_fee;
    } else if (locations?.zones?.nakhchivan?.includes(addrCity)) {
      deliveryFee = fees.nakhchivan_fee;
    } else if (locations?.zones?.karabakh?.includes(addrCity)) {
      deliveryFee = fees.karabakh_fee;
    } else {
      deliveryFee = fees.region_fee;
    }
  }

  const total = goodsTotal + (deliveryFee ?? 0);

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
            <h1 className="text-2xl font-bold leading-8 text-foreground sm:text-[32px] sm:leading-10">
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
                id="btn-cart-login"
                type="button"
                onClick={() => openAuth()}
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
                id="btn-cart-start-shopping"
                href="/mehsullar"
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
                    id="btn-cart-apply-promo"
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

              {deliveryFee !== null && (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] leading-5 text-[#666666]">
                      {t("cart.delivery")}
                    </span>
                    <span className="text-[14px] font-semibold leading-5 text-foreground">
                      {deliveryFee === 0 ? t("cart.freeDelivery") : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  {deliveryFee > 0 &&
                    addrCity === (locations?.baku ?? "Bakı") &&
                    fees?.baku_free_threshold > 0 && (
                      <p className="text-[12px] leading-[18px] text-zinc-500">
                        {Number(fees.baku_free_threshold)} {t("cart.freeOverSuffix")}
                      </p>
                    )}
                </div>
              )}

              <div className="flex flex-col border-t border-[#CCCCCC] pt-[17px]">
                <span className="text-[14px] leading-5 text-[#666666]">
                  {t("cart.totalAmount")}
                </span>
                <span className="text-2xl font-bold leading-8 text-foreground">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium leading-5 text-foreground">
                {t("cart.deliveryAddress")}
              </p>

              {addrMode === "saved" && savedAddr ? (
                <div className="flex flex-col gap-3 rounded-xl border border-brand-primary bg-white p-3">
                  <div className="flex items-start gap-2">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-brand-primary"
                    >
                      <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
                      <path
                        d="M5.5 9.2L7.8 11.5L12.5 6.8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="text-sm font-medium leading-5 text-foreground">
                        {t("cart.savedAddressTitle")}
                      </span>
                      <span className="text-xs leading-4 text-zinc-600">
                        {composeDeliveryAddress({
                          city: savedAddr.city,
                          district: savedAddr.city === bakuName ? savedAddr.district : "",
                          street: savedAddr.street,
                          building: savedAddr.building,
                          apartment: savedAddr.apartment || null,
                        })}
                      </span>
                      {savedAddr.note && (
                        <span className="text-xs leading-4 text-zinc-500">{savedAddr.note}</span>
                      )}
                    </div>
                  </div>

                  <button
                    id="btn-cart-change-address"
                    type="button"
                    onClick={() => setAddrMode("custom")}
                    className="h-10 w-full cursor-pointer rounded-3xl border border-brand-primary text-sm font-medium leading-5 text-brand-primary transition-colors hover:bg-brand-primary hover:text-white"
                  >
                    {t("cart.changeAddress")}
                  </button>
                </div>
              ) : (
                <>
                  <DeliveryAddressFields
                    idPrefix="btn-address"
                    values={addr}
                    onChange={(field, value) => {
                      setAddr((prev) => ({ ...prev, [field]: value }));
                      setAddrErrors((prev) => ({ ...prev, [field]: false }));
                    }}
                    errors={addrErrors}
                    locations={locations}
                    t={t}
                  />

                  {savedAddr && (
                    <button
                      id="btn-cart-use-saved-address"
                      type="button"
                      onClick={() => {
                        setAddr(savedAddr);
                        setAddrErrors({});
                        setAddrMode("saved");
                      }}
                      className="w-max cursor-pointer text-sm text-brand-primary underline transition-colors hover:text-brand-primary-hover"
                    >
                      {t("cart.useSavedAgain")}
                    </button>
                  )}
                </>
              )}
            </div>

            {status && !status.ok && (
              <p className="text-[12px] leading-[18px] text-red-600">{status.text}</p>
            )}

            <button
              id="btn-cart-place-order"
              type="button"
              disabled={busy}
              onClick={handlePlaceOrder}
              className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-3xl bg-brand-primary text-base font-medium leading-5 text-white transition-colors hover:bg-brand-primary-hover disabled:cursor-default disabled:opacity-60"
            >
              <CardIcon />
              {busy ? t("common.loading") : t("cart.placeOrder")}
            </button>

            <p className="text-center text-[12px] leading-[18px] text-zinc-500">
              {t("cart.agreeText")}{" "}
              <Link
                href="/geri-qaytarma"
                className="text-brand-primary underline transition-colors hover:text-brand-primary-hover"
              >
                {t("legal.returnPolicy")}
              </Link>{" "}
              {t("cart.agreeAnd")}{" "}
              <Link
                href="/mexfilik-siyaseti"
                className="text-brand-primary underline transition-colors hover:text-brand-primary-hover"
              >
                {t("legal.privacyPolicy")}
              </Link>{" "}
              {t("cart.agreeSuffix")}
            </p>
          </aside>
        )}
    </div>
  );
}
