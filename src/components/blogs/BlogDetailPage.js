"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import NotFoundPage from "@/components/common/NotFoundPage";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/utils/api";

function processContent(html) {
  if (!html) return { html: "", toc: [] };

  const toc = [];
  let counter = 0;

  const processed = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, level, attrs, inner) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();

      if (!text) return match;

      counter += 1;
      const id = `basliq-${counter}`;
      toc.push({ id, text, level: Number(level) });
      return `<h${level} id="${id}"${attrs}>${inner}</h${level}>`;
    },
  );

  return { html: processed, toc };
}

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

  const content = useMemo(() => processContent(blog?.content), [blog?.content]);

  if (notFound) {
    return <NotFoundPage />;
  }

  return (
    <section className="mx-auto w-full px-4 pb-20 pt-6 sm:px-6 lg:px-[108px] lg:pt-16">
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
              <h1 className="text-2xl font-bold leading-8 text-foreground sm:text-[32px] sm:leading-10">
                {blog.title}
              </h1>

              {content.toc.length >= 2 && (
                <nav className="rounded-2xl border border-header-border bg-header-icon-bg p-5">
                  <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
                    {t("blogs.toc")}
                  </p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {content.toc.map((item) => (
                      <li key={item.id} className={item.level === 3 ? "pl-4" : ""}>
                        <a
                          href={`#${item.id}`}
                          className="text-sm leading-5 text-foreground transition-colors hover:text-brand-primary"
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              <div
                className="flex flex-col gap-5 text-base leading-7 text-foreground [&_a]:text-brand-primary [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-brand-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-4 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-8 [&_h3]:mt-2 [&_h3]:scroll-mt-24 [&_h3]:text-xl [&_h3]:font-bold [&_h4]:font-bold [&_img]:rounded-2xl [&_li]:ml-5 [&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-2 [&_strong]:font-semibold [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2"
                dangerouslySetInnerHTML={{ __html: content.html }}
              />
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
