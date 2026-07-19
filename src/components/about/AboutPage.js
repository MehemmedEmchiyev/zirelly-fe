"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/utils/api";

function AboutSkeleton() {
  return (
    <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex w-full flex-col gap-4 lg:w-[600px]">
        <div className="h-8 w-1/2 animate-pulse rounded-full bg-header-icon-bg" />
        <div className="h-4 w-full animate-pulse rounded-full bg-header-icon-bg" />
        <div className="h-4 w-full animate-pulse rounded-full bg-header-icon-bg" />
        <div className="h-4 w-2/3 animate-pulse rounded-full bg-header-icon-bg" />
      </div>
      <div className="aspect-[600/400] w-full animate-pulse rounded-3xl bg-header-icon-bg lg:w-[600px]" />
    </div>
  );
}

export default function AboutPage() {
  const { language } = useLanguage();
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);

    apiFetch("/about", { lang: language })
      .then((response) => {
        if (cancelled) return;
        setAbout(response.data);
      })
      .catch(() => {})
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [language]);

  const hero = about?.hero;
  const section = about?.section;

  return (
    <div className="mx-auto w-full px-4 pb-20 pt-16 sm:px-6 lg:px-[108px] lg:pt-[100px]">
      <div className="mx-auto flex w-full max-w-[1224px] flex-col gap-16 lg:gap-20">
        {loading && <AboutSkeleton />}

        {!loading && (hero?.title || hero?.description || hero?.image) && (
          <section className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full min-w-0 flex-col gap-4 lg:w-[600px]">
              {hero?.title && (
                <h1 className="text-[32px] font-bold leading-10 text-foreground">
                  {hero.title}
                </h1>
              )}

              {hero?.description && (
                <div
                  className="flex flex-col gap-4 text-base leading-5 text-foreground [&_a]:text-brand-primary [&_a]:underline [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc"
                  dangerouslySetInnerHTML={{ __html: hero.description }}
                />
              )}
            </div>

            {hero?.image?.url && (
              <div className="relative aspect-[600/400] w-full shrink-0 overflow-hidden rounded-3xl bg-header-icon-bg lg:w-[600px]">
                <Image
                  src={hero.image.url}
                  alt={hero.title ?? ""}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </section>
        )}

        {!loading && (section?.title || section?.items?.length > 0) && (
          <section className="flex flex-col gap-6">
            {section?.title && (
              <h2 className="text-[32px] font-bold leading-10 text-foreground">
                {section.title}
              </h2>
            )}

            <div className="flex flex-col items-stretch gap-6 lg:flex-row">
              {section?.items?.length > 0 && (
                <div className="flex w-full min-w-0 flex-col gap-5 lg:w-[600px] lg:shrink-0">
                  {section.items.map((item, index) => (
                    <article
                      key={item.id}
                      className="flex flex-col gap-4 rounded-3xl border border-header-border bg-white p-6"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-2xl font-bold leading-8 text-white">
                        {index + 1}
                      </span>

                      <div className="flex flex-col gap-2">
                        <h3 className="text-2xl font-bold leading-8 text-foreground">
                          {item.title}
                        </h3>
                        <div
                          className="text-base leading-5 text-[#666666] [&_p]:mb-2 [&_p:last-child]:mb-0"
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {section?.image?.url && (
                <div className="relative min-h-[280px] w-full overflow-hidden rounded-3xl bg-header-icon-bg lg:min-h-0 lg:w-[600px] lg:shrink-0 lg:self-stretch">
                  <Image
                    src={section.image.url}
                    alt={section.title ?? ""}
                    fill
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
