"use client";

import { useState } from "react";
import ModalShell from "@/components/layout/ModalShell";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/utils/api";

const inputClasses =
  "h-12 w-full rounded-xl border border-[var(--content-secondary-inverse)] bg-white px-4 text-sm text-foreground outline-none transition-colors placeholder:text-zinc-400 focus:border-brand-primary";

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  onCodeSent,
  onSwitchToLogin,
}) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      onCodeSent(email);
      setEmail("");
    } catch (err) {
      setError(err.message || t("auth.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} titleId="forgot-modal-title">
      <div className="pt-2 text-center">
        <h2 id="forgot-modal-title" className="text-xl font-semibold text-foreground">
          {t("auth.forgotTitle")}
        </h2>
        <p className="mt-2 text-sm text-zinc-500">{t("auth.forgotSubtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label
            htmlFor="forgot-email"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            {t("auth.email")}
          </label>
          <input
            id="forgot-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="example@gmail.com"
            className={inputClasses}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-12 w-full cursor-pointer rounded-full bg-brand-primary text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover disabled:cursor-default disabled:opacity-60"
        >
          {loading ? t("common.loading") : t("auth.sendCode")}
        </button>

        <p className="text-center text-sm text-zinc-500">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="cursor-pointer font-medium text-brand-primary hover:underline"
          >
            {t("auth.backToLogin")}
          </button>
        </p>
      </form>
    </ModalShell>
  );
}
