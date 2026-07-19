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
      className="flex flex-col gap-4 rounded-2xl border border-[var(--content-secondary-inverse)] bg-white p-3 transition-shadow hover:shadow-[0px_0px_4px_0px_#00000014,0px_4px_8px_0px_#0000001A] sm:flex-row"
    >
      <div className="relative aspect-[296/150] w-full shrink-0 overflow-hidden rounded-lg bg-header-icon-bg sm:w-[296px]">
        {blog.image && (
          <Image
            src={blog.image}
            alt={blog.title ?? ""}
            fill
            sizes="(max-width: 640px) 100vw, 296px"
            className="object-cover"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 self-stretch">
        <p className="line-clamp-5 text-[12px] leading-[18px] text-[#666666]">
          {stripHtml(blog.content)}
        </p>

        <span className="text-[12px] font-[510] leading-[18px] text-foreground underline [text-underline-position:from-font]">
          {t("blogs.readMore")}
        </span>
      </div>
    </Link>
  );
}
