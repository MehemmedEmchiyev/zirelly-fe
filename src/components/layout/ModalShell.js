"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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

export default function ModalShell({
  isOpen,
  onClose,
  titleId,
  maxWidthClass = "max-w-[400px]",
  children,
}) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsVisible(false);
      return;
    }

    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    function handleEscape(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative max-h-[90vh] w-full ${maxWidthClass} overflow-y-auto rounded-2xl border border-[var(--content-secondary-inverse)] bg-white p-5 shadow-[0px_0px_4px_0px_#00000014,0px_4px_8px_0px_#0000001A] transition-all duration-300 ease-out ${
          isVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-95 opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-header-icon-bg text-foreground transition-colors hover:bg-[#e8e8e8]"
        >
          <CloseIcon />
        </button>

        {children}
      </div>
    </div>,
    document.body,
  );
}
