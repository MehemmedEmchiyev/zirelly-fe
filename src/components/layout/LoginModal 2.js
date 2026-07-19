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

export default function LoginModal({ isOpen, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  function handleSubmit(event) {
    event.preventDefault();
    onClose();
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close login modal"
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        className={`relative w-full max-w-[400px] rounded-2xl border border-[var(--content-secondary-inverse)] bg-white p-5 shadow-[0px_0px_4px_0px_#00000014,0px_4px_8px_0px_#0000001A] transition-all duration-300 ease-out ${
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

        <div className="pt-2 text-center">
          <h2
            id="login-modal-title"
            className="text-xl font-semibold text-foreground"
          >
            Log In
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Enter your phone number to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label
              htmlFor="login-email"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ajdarkalbiyev@gmail.com"
              className="h-12 w-full rounded-xl border border-[var(--content-secondary-inverse)] bg-white px-4 text-sm text-foreground outline-none transition-colors placeholder:text-zinc-400 focus:border-brand-primary"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="****************"
              className="h-12 w-full rounded-xl border border-[var(--content-secondary-inverse)] bg-white px-4 text-sm text-foreground outline-none transition-colors placeholder:text-zinc-400 focus:border-brand-primary"
            />
          </div>

          <button
            type="submit"
            className="mt-2 h-12 w-full cursor-pointer rounded-full bg-brand-primary text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover"
          >
            Get the Code
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}
