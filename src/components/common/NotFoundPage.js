"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto w-full px-4 pb-20 pt-6 sm:px-6 lg:px-[108px] lg:pt-16">
      <div className="mx-auto flex w-full max-w-[1224px] flex-col items-center rounded-3xl border border-header-border bg-header-icon-bg px-6 py-16 text-center sm:py-24">
        <p className="font-serif text-[96px] font-semibold leading-none text-brand-primary sm:text-[128px]">
          404
        </p>

        <h1 className="mt-6 text-2xl font-bold leading-8 text-foreground sm:text-[32px] sm:leading-10">
          {t("notFound.title")}
        </h1>

        <p className="mt-3 max-w-md text-base leading-6 text-zinc-500">
          {t("notFound.text")}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="flex h-12 items-center justify-center rounded-3xl bg-brand-primary px-8 text-base font-medium leading-5 text-white transition-colors hover:bg-brand-primary-hover"
          >
            {t("notFound.home")}
          </Link>
          <Link
            href="/mehsullar"
            className="flex h-12 items-center justify-center rounded-3xl border border-header-border bg-white px-8 text-base font-medium leading-5 text-foreground transition-colors hover:bg-zinc-50"
          >
            {t("nav.products")}
          </Link>
        </div>
      </div>
    </section>
  );
}
