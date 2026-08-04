"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { authFetch } from "@/utils/api";

const STATUS_STYLES = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-red-100 text-red-600",
};

function formatPrice(value) {
  return `${Number(value).toFixed(2)} ₼`;
}

function OrdersSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="h-[76px] w-full animate-pulse rounded-2xl bg-white" />
      ))}
    </div>
  );
}

function OrderCard({ order, language, t }) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const createdAt = order.created_at
    ? new Date(order.created_at).toLocaleDateString(
        language === "ru" ? "ru-RU" : language === "en" ? "en-GB" : "az-Latn-AZ",
        { day: "numeric", month: "long", year: "numeric" },
      )
    : null;

  function toggle() {
    const next = !open;
    setOpen(next);

    if (next && details === null && !loadingDetails) {
      setLoadingDetails(true);
      authFetch(`/orders/${order.id}`)
        .then((response) => setDetails(response.data))
        .catch(() => {})
        .finally(() => setLoadingDetails(false));
    }
  }

  const statusClass = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending;

  return (
    <div className="rounded-2xl bg-white">
      <button
        type="button"
        onClick={toggle}
        className="flex w-full cursor-pointer flex-wrap items-center justify-between gap-3 p-4 text-left"
        aria-expanded={open}
      >
        <div className="flex flex-col gap-1">
          <span className="text-base font-bold leading-5 text-foreground">
            {t("orders.order")} #{order.id}
          </span>
          <span className="text-xs leading-[18px] text-zinc-500">
            {createdAt}
            {order.items_count > 0 && (
              <> &middot; {order.items_count} {t("cart.items")}</>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium leading-[18px] ${statusClass}`}
          >
            {t(`orders.status.${order.status}`)}
          </span>
          <span className="text-base font-bold leading-5 text-foreground">
            {formatPrice(order.total)}
          </span>
        </div>
      </button>

      {open && (
        <div className="border-t border-header-border px-4 py-3">
          {loadingDetails && (
            <div className="flex flex-col gap-2">
              <div className="h-4 w-2/3 animate-pulse rounded-full bg-header-icon-bg" />
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-header-icon-bg" />
            </div>
          )}

          {!loadingDetails && details && (
            <div className="flex flex-col gap-2">
              {details.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 text-sm leading-5"
                >
                  <span className="min-w-0 truncate text-foreground">
                    {item.title}
                    <span className="text-zinc-500"> &times; {item.quantity}</span>
                  </span>
                  <span className="shrink-0 text-foreground">
                    {formatPrice(item.line_total)}
                  </span>
                </div>
              ))}

              {Number(details.discount_amount) > 0 && (
                <div className="flex items-center justify-between gap-3 border-t border-header-border pt-2 text-sm leading-5 text-zinc-500">
                  <span>
                    {t("cart.totalDiscount")}
                    {details.promocode_code && <> ({details.promocode_code})</>}
                  </span>
                  <span>-{formatPrice(details.discount_amount)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function OrdersList() {
  const { t, language } = useLanguage();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    authFetch("/orders")
      .then((response) => {
        if (cancelled) return;
        setOrders(response.data ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <div className="rounded-xl bg-header-icon-bg px-4 py-3">
        <h1 className="text-base font-bold leading-5 text-foreground">
          {t("profile.orders")}
        </h1>
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-header-border bg-header-icon-bg p-4 sm:p-6">
        {orders === null && !error && <OrdersSkeleton />}

        {error && (
          <p className="py-6 text-center text-sm text-zinc-500">{t("cart.error")}</p>
        )}

        {orders !== null && orders.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-10 text-center">
            <p className="text-base text-zinc-500">{t("orders.empty")}</p>
            <Link
              href="/products"
              className="rounded-3xl bg-brand-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover"
            >
              {t("cart.startShopping")}
            </Link>
          </div>
        )}

        {orders !== null &&
          orders.map((order) => (
            <OrderCard key={order.id} order={order} language={language} t={t} />
          ))}
      </div>
    </div>
  );
}
