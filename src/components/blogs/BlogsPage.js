"use client";

import { useEffect, useState } from "react";
import BlogCard from "@/components/blogs/BlogCard";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/utils/api";

const PER_PAGE = 8;

function BlogCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-header-border bg-white p-3 sm:flex-row">
      <div className="aspect-[288/150] w-full shrink-0 animate-pulse rounded-lg bg-header-icon-bg sm:w-[288px]" />
      <div className="flex flex-1 flex-col justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-3.5 w-full animate-pulse rounded-full bg-header-icon-bg" />
          <div className="h-3.5 w-full animate-pulse rounded-full bg-header-icon-bg" />
          <div className="h-3.5 w-2/3 animate-pulse rounded-full bg-header-icon-bg" />
        </div>
        <div className="h-3.5 w-20 animate-pulse rounded-full bg-header-icon-bg" />
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
    <section className="mx-auto w-full px-4 py-16 sm:px-6 lg:px-[108px]">
      <div className="mx-auto w-full max-w-[1224px]">
        <h1 className="text-[32px] font-bold leading-10 text-foreground">
          {t("blogs.title")}
        </h1>

        {error && (
          <p className="mt-10 text-center text-zinc-500">{t("blogs.error")}</p>
        )}

        {!error && blogs === null && (
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {Array.from({ length: 4 }, (_, i) => (
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
              <div className="mt-[72px] flex justify-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex h-11 cursor-pointer items-center rounded-full bg-brand-primary px-6 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover disabled:cursor-default disabled:opacity-60"
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
