"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/utils/api";

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M1 1L13 13M13 1L1 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function SitePopup() {
  const { language } = useLanguage();
  const [popup, setPopup] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;

    apiFetch("/popup", { lang: language })
      .then((response) => {
        if (cancelled) return;
        setPopup(response.data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [language]);

  useEffect(() => {
    if (!popup?.is_active || !popup.title) return;

    if (popup.show_once && localStorage.getItem(STORAGE_KEYS.POPUP_SEEN)) {
      return;
    }

    const timer = setTimeout(
      () => setIsOpen(true),
      (popup.delay_seconds ?? 0) * 1000,
    );

    return () => clearTimeout(timer);
  }, [popup]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    let inner = 0;
    const frame = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setIsVisible(true));
    });

    function handleEscape(event) {
      if (event.key === "Escape") handleClose();
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(inner);
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  function handleClose() {
    if (popup?.show_once) {
      localStorage.setItem(STORAGE_KEYS.POPUP_SEEN, "1");
    }

    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 300);
  }

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="site-popup-title"
        className={`relative flex max-h-[90vh] w-full max-w-[390px] flex-col-reverse overflow-hidden rounded-3xl bg-white shadow-[0px_8px_32px_0px_rgba(0,0,0,0.18)] transition-all duration-300 ease-out lg:max-w-[780px] lg:flex-row ${
          isVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-95 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 overflow-y-auto p-6 lg:w-1/2 lg:justify-center lg:p-10">
          <h2
            id="site-popup-title"
            className="text-[26px] font-extrabold uppercase italic leading-8 text-foreground lg:text-[32px] lg:leading-[40px]"
          >
            {popup.title}
          </h2>

          {popup.description && (
            <p className="text-sm leading-6 text-zinc-600">{popup.description}</p>
          )}

          {popup.button_text &&
            (popup.button_link ? (
              <Link
                href={popup.button_link}
                onClick={handleClose}
                className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-brand-primary text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover"
              >
                {popup.button_text}
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleClose}
                className="mt-2 flex h-12 w-full cursor-pointer items-center justify-center rounded-full bg-brand-primary text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover"
              >
                {popup.button_text}
              </button>
            ))}
        </div>

        <div className="relative aspect-[4/3] w-full shrink-0 bg-header-icon-bg lg:aspect-auto lg:w-1/2 lg:self-stretch">
          {popup.image?.url && (
            <Image
              src={popup.image.url}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 390px"
              className="object-cover"
            />
          )}

          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/90 text-foreground transition-colors hover:bg-white"
          >
            <CloseIcon />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
