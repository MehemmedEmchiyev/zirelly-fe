"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import NotFoundPage from "@/components/common/NotFoundPage";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/utils/api";
import { formatDate } from "@/utils/blog";

function BackArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M13 8H3M3 8L7.5 3.5M3 8L7.5 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BlogDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[800px]">
      <div className="h-4 w-32 animate-pulse rounded-full bg-header-icon-bg" />
      <div className="mt-6 h-9 w-3/4 animate-pulse rounded-full bg-header-icon-bg" />
      <div className="mt-4 h-4 w-28 animate-pulse rounded-full bg-header-icon-bg" />
      <div className="mt-6 aspect-[16/9] w-full animate-pulse rounded-3xl bg-header-icon-bg" />
      <div className="mt-8 flex flex-col gap-3">
        <div className="h-4 w-full animate-pulse rounded-full bg-header-icon-bg" />
        <div className="h-4 w-full animate-pulse rounded-full bg-header-icon-bg" />
        <div className="h-4 w-2/3 animate-pulse rounded-full bg-header-icon-bg" />
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
    <section className="mx-auto w-full px-4 py-12 sm:px-6 lg:px-[108px]">
      {error && (
        <p className="mt-10 text-center text-zinc-500">{t("blogs.error")}</p>
      )}

      {!error && blog === null && <BlogDetailSkeleton />}

      {!error && blog !== null && (
        <article className="mx-auto w-full max-w-[800px]">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary transition-colors hover:text-brand-primary-hover"
          >
            <BackArrowIcon />
            {t("blogs.back")}
          </Link>

          <h1 className="mt-6 text-[32px] font-semibold leading-10 text-foreground">
            {blog.title}
          </h1>

          <p className="mt-3 text-sm text-zinc-500">
            {formatDate(blog.published_at, language)}
          </p>

          {blog.image && (
            <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-3xl bg-header-icon-bg">
              <Image
                src={blog.image}
                alt={blog.title ?? ""}
                fill
                sizes="(max-width: 800px) 100vw, 800px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <div
            className="mt-8 text-base leading-7 text-foreground [&_a]:text-brand-primary [&_a]:underline [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_img]:my-4 [&_img]:rounded-2xl [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-4 [&_ul]:list-disc"
            dangerouslySetInnerHTML={{ __html: blog.content ?? "" }}
          />
        </article>
      )}
    </section>
  );
}
