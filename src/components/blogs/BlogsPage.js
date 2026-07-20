"use client";

import { useEffect, useState } from "react";
import BlogCard from "@/components/blogs/BlogCard";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/utils/api";

const PER_PAGE = 8;

function BlogCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--content-secondary-inverse)] bg-white p-3 sm:flex-row">
      <div className="aspect-[296/150] w-full shrink-0 animate-pulse rounded-lg bg-header-icon-bg sm:w-[296px]" />
      <div className="flex flex-1 flex-col justify-between gap-4 py-1">
        <div className="flex flex-col gap-2">
          <div className="h-3 w-full animate-pulse rounded-full bg-header-icon-bg" />
          <div className="h-3 w-full animate-pulse rounded-full bg-header-icon-bg" />
          <div className="h-3 w-2/3 animate-pulse rounded-full bg-header-icon-bg" />
        </div>
        <div className="h-3 w-16 animate-pulse rounded-full bg-header-icon-bg" />
      </div>
    </div>
  );
}

export default function BlogsPage() {
  const { language, t } = useLanguage();
  const [blogs, setBlogs] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setBlogs(null);
    setMeta(null);
    setError(false);

    apiFetch(`/blogs?published=1&per_page=${PER_PAGE}&page=1`, {
      lang: language,
    })
      .then((response) => {
        if (cancelled) return;
        setBlogs(response.data);
        setMeta(response.meta);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [language]);

  function handleLoadMore() {
    if (loadingMore || !meta) return;

    setLoadingMore(true);

    apiFetch(
      `/blogs?published=1&per_page=${PER_PAGE}&page=${meta.current_page + 1}`,
      { lang: language },
    )
      .then((response) => {
        setBlogs((prev) => [...(prev ?? []), ...response.data]);
        setMeta(response.meta);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoadingMore(false);
      });
  }

  const hasMore = meta && meta.current_page < meta.last_page;

  return (
    <section className="mx-auto w-full px-4 pb-20 pt-6 sm:px-6 lg:px-[108px] lg:pt-16">
      <div className="mx-auto w-full max-w-[1224px]">
        <h1 className="text-2xl font-bold leading-8 text-foreground sm:text-[32px] sm:leading-10">
          {t("blogs.title")}
        </h1>

        {error && (
          <p className="mt-10 text-center text-zinc-500">{t("blogs.error")}</p>
        )}

        {!error && blogs === null && (
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {Array.from({ length: PER_PAGE }, (_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!error && blogs?.length === 0 && (
          <p className="mt-10 text-center text-zinc-500">{t("blogs.empty")}</p>
        )}

        {!error && blogs?.length > 0 && (
          <>
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-[60px] flex justify-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex h-[52px] cursor-pointer items-center rounded-3xl bg-brand-primary px-6 text-base font-medium leading-5 text-white transition-colors hover:bg-brand-primary-hover disabled:cursor-default disabled:opacity-60"
                >
                  {loadingMore ? t("common.loading") : t("blogs.loadMore")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
