"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const ToastContext = createContext(null);

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15" />
      <path
        d="M6 10.2L8.8 13L14 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const showToast = useCallback((message, { actionLabel, actionHref } = {}) => {
    const id = ++idRef.current;

    setToasts((prev) => [...prev.slice(-2), { id, message, actionLabel, actionHref }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-6 z-[100] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex w-full max-w-[360px] items-center gap-3 rounded-2xl border border-header-border bg-white px-4 py-3 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.05),0px_10px_24px_0px_rgba(0,0,0,0.12)] animate-toast-in"
          >
            <span className="shrink-0 text-brand-primary">
              <CheckIcon />
            </span>

            <p className="min-w-0 flex-1 text-sm font-medium leading-5 text-foreground">
              {toast.message}
            </p>

            {toast.actionHref && toast.actionLabel && (
              <Link
                href={toast.actionHref}
                onClick={() => dismiss(toast.id)}
                className="shrink-0 whitespace-nowrap rounded-xl bg-brand-primary px-3 py-2 text-xs font-medium leading-4 text-white transition-colors hover:bg-brand-primary-hover"
              >
                {toast.actionLabel}
              </Link>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
