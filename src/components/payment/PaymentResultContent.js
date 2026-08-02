"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

const VARIANTS = {
  success: {
    icon: "✓",
    iconClass: "bg-green-100 text-green-600",
    titleKey: "payment.successTitle",
    textKey: "payment.successText",
  },
  failed: {
    icon: "✕",
    iconClass: "bg-red-100 text-red-600",
    titleKey: "payment.failedTitle",
    textKey: "payment.failedText",
  },
  pending: {
    icon: "…",
    iconClass: "bg-amber-100 text-amber-600",
    titleKey: "payment.pendingTitle",
    textKey: "payment.pendingText",
  },
};

export default function PaymentResultContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  const status = searchParams.get("status");
  const order = searchParams.get("order");
  const variant = VARIANTS[status] ?? VARIANTS.pending;

  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <div
        className={`flex h-20 w-20 items-center justify-center rounded-full text-4xl font-bold ${variant.iconClass}`}
        aria-hidden="true"
      >
        {variant.icon}
      </div>
      <h1 className="mt-6 text-2xl font-bold text-foreground sm:text-3xl">
        {t(variant.titleKey)}
      </h1>
      {order && (
        <p className="mt-2 text-sm text-zinc-500">
          {t("payment.orderLabel")} #{order}
        </p>
      )}
      <p className="mt-4 max-w-md text-base text-zinc-600">{t(variant.textKey)}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {variant === VARIANTS.failed ? (
          <Link
            href="/cart"
            className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            {t("payment.retry")}
          </Link>
        ) : (
          <Link
            href="/profile"
            className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            {t("payment.goOrders")}
          </Link>
        )}
        <Link
          href="/"
          className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
        >
          {t("payment.goHome")}
        </Link>
      </div>
    </section>
  );
}
