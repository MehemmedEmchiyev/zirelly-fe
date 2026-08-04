"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/utils/api";

function LegalSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-9 w-2/3 animate-pulse rounded-full bg-header-icon-bg" />
      <div className="h-4 w-40 animate-pulse rounded-full bg-header-icon-bg" />
      <div className="flex flex-col gap-3 pt-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className={`h-4 animate-pulse rounded-full bg-header-icon-bg ${i % 3 === 2 ? "w-2/3" : "w-full"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function LegalPageContent({ slug }) {
  const { t, language } = useLanguage();
  const [result, setResult] = useState({ key: null, page: null, error: false });

  const requestKey = `${slug}:${language}`;
  const loading = result.key !== requestKey;
  const { page, error } = result;

  useEffect(() => {
    let cancelled = false;

    apiFetch(`/legal/${slug}`, { lang: language })
      .then((response) => {
        if (cancelled) return;
        setResult({ key: `${slug}:${language}`, page: response.data, error: false });
      })
      .catch(() => {
        if (cancelled) return;
        setResult({ key: `${slug}:${language}`, page: null, error: true });
      });

    return () => {
      cancelled = true;
    };
  }, [slug, language]);

  const updatedAt = page?.updated_at
    ? new Date(page.updated_at).toLocaleDateString(
        language === "ru" ? "ru-RU" : language === "en" ? "en-GB" : "az-Latn-AZ",
        { day: "numeric", month: "long", year: "numeric" },
      )
    : null;

  return (
    <section className="mx-auto w-full px-4 pb-20 pt-6 sm:px-6 lg:px-[108px] lg:pt-16">
      <div className="mx-auto w-full max-w-[840px]">
        {loading && <LegalSkeleton />}

        {!loading && error && (
          <p className="mt-10 text-center text-zinc-500">{t("cart.error")}</p>
        )}

        {!loading && !error && page && (
          <article className="flex flex-col">
            <header className="flex flex-col gap-3 border-b border-header-border pb-8">
              <h1 className="text-2xl font-bold leading-8 text-foreground sm:text-[32px] sm:leading-10">
                {page.title}
              </h1>
              <p className="text-sm font-medium text-brand-primary">Zirelly MMC</p>
              {updatedAt && (
                <p className="text-sm text-zinc-500">
                  {t("legal.updated")}: {updatedAt}
                </p>
              )}
            </header>

            <div
              className="flex flex-col gap-5 pt-8 text-base leading-7 text-foreground [&_a]:text-brand-primary [&_a]:underline [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:leading-7 [&_h3]:text-lg [&_h3]:font-bold [&_li]:ml-5 [&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-2 [&_strong]:font-semibold [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2"
              dangerouslySetInnerHTML={{ __html: page.content ?? "" }}
            />
          </article>
        )}
      </div>
    </section>
  );
}
