"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import NotFoundPage from "@/components/common/NotFoundPage";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/utils/api";

function BlogDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
      <div className="aspect-[600/560] w-full shrink-0 animate-pulse rounded-[20px] bg-header-icon-bg lg:w-[600px]" />
      <div className="flex w-full flex-col gap-12">
        <div className="flex flex-col gap-3">
          <div className="h-7 w-full animate-pulse rounded-full bg-header-icon-bg" />
          <div className="h-7 w-2/3 animate-pulse rounded-full bg-header-icon-bg" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-4 w-full animate-pulse rounded-full bg-header-icon-bg" />
          <div className="h-4 w-full animate-pulse rounded-full bg-header-icon-bg" />
          <div className="h-4 w-3/4 animate-pulse rounded-full bg-header-icon-bg" />
        </div>
      </div>
    </div>
  );
}

export default function BlogDetailPage({ slug }) {
  const { language, t } = useLanguage();
  const [blog, setBlog] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setBlog(null);
    setNotFound(false);
    setError(false);

    apiFetch(`/blogs/slug/${encodeURIComponent(slug)}`, { lang: language })
      .then((response) => {
        if (cancelled) return;
        setBlog(response.data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.status === 404) {
          setNotFound(true);
        } else {
          setError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug, language]);

  if (notFound) {
    return <NotFoundPage />;
  }

  return (
    <section className="mx-auto w-full px-4 pb-20 pt-16 sm:px-6 lg:px-[108px] lg:pt-[100px]">
      <div className="mx-auto w-full max-w-[1224px]">
        {error && (
          <p className="mt-10 text-center text-zinc-500">{t("blogs.error")}</p>
        )}

        {!error && blog === null && <BlogDetailSkeleton />}

        {!error && blog !== null && (
          <article className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="relative aspect-[600/560] w-full shrink-0 overflow-hidden rounded-[20px] bg-header-icon-bg shadow-[0px_0px_10px_0px_rgba(0,0,0,0.03),0px_6px_10px_0px_rgba(0,0,0,0.07)] lg:w-[600px]">
              {blog.image && (
                <Image
                  src={blog.image}
                  alt={blog.title ?? ""}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                  priority
                />
              )}
            </div>

            <div className="flex w-full min-w-0 flex-col gap-12">
              <h1 className="text-[32px] font-bold leading-10 text-foreground">
                {blog.title}
              </h1>

              <div
                className="flex flex-col gap-6 text-base leading-5 text-foreground [&_a]:text-brand-primary [&_a]:underline [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-bold [&_img]:rounded-2xl [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc"
                dangerouslySetInnerHTML={{ __html: blog.content ?? "" }}
              />
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
