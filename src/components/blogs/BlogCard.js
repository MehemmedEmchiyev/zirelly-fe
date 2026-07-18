"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { stripHtml } from "@/utils/blog";

export default function BlogCard({ blog }) {
  const { t } = useLanguage();

  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="flex flex-col gap-4 rounded-xl border border-header-border bg-white p-3 transition-shadow hover:shadow-[0px_0px_4px_0px_#00000014,0px_4px_8px_0px_#0000001A] sm:flex-row"
    >
      <div className="relative aspect-[288/150] w-full shrink-0 overflow-hidden rounded-lg bg-header-icon-bg sm:w-[288px]">
        {blog.image && (
          <Image
            src={blog.image}
            alt={blog.title ?? ""}
            fill
            sizes="(max-width: 640px) 100vw, 288px"
            className="object-cover"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
        <p className="line-clamp-4 text-sm leading-[18px] text-zinc-600">
          {stripHtml(blog.content)}
        </p>

        <span className="text-sm leading-[18px] text-foreground underline underline-offset-2">
          {t("blogs.readMore")}
        </span>
      </div>
    </Link>
  );
}
