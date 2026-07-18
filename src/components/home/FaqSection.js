"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

function ChevronIcon({ className }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FaqItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="overflow-hidden rounded-[40px] bg-[var(--content-secondary-inverse,#F3F3F3)]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-[14px] text-left"
      >
        <span className="text-base font-normal leading-5 text-foreground">
          {question}
        </span>
        <ChevronIcon
          className={`shrink-0 text-zinc-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-200 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-4 pb-4 text-sm font-normal leading-5 text-zinc-500">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FaqSection({ title, items }) {
  const [openId, setOpenId] = useState(null);
  const { t } = useLanguage();

  if (!items?.length) {
    return null;
  }

  return (
    <section className="w-full px-4 py-10 sm:px-6 sm:py-16 lg:px-[108px] lg:py-20">
      <div className="mx-auto flex max-w-[1224px] flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-16">
        <div className="flex flex-col justify-between gap-8 lg:min-h-[320px] lg:w-[42%] lg:shrink-0">
          <p className="text-base font-bold leading-5 text-zinc-400">
            {t("home.faqLabel")}
          </p>

          <h2 className="text-[40px] font-[510] leading-[48px] text-foreground sm:text-[52px] sm:leading-[60px] lg:text-[64px] lg:leading-[72px]">
            {title || t("home.faqTitle")}
          </h2>

          <p className="text-base font-normal leading-5 text-zinc-500">
            {t("home.faqContact")}
            <Link
              href="/contact"
              className="text-foreground transition-colors hover:text-brand-primary"
            >
              Zirelly.az
            </Link>
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-4">
          {items.map((faq) => (
            <FaqItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              isOpen={openId === faq.id}
              onToggle={() =>
                setOpenId((prev) => (prev === faq.id ? null : faq.id))
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
