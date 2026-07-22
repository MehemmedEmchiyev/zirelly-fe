"use client";

import { useState } from "react";
import ModalShell from "@/components/layout/ModalShell";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/utils/api";

const inputClasses =
  "h-12 w-full rounded-xl border border-[var(--content-secondary-inverse)] bg-white px-4 text-center text-lg tracking-[8px] text-foreground outline-none transition-colors placeholder:tracking-normal placeholder:text-zinc-400 focus:border-brand-primary";

export default function OtpModal({ isOpen, onClose, email, onSwitchToLogin }) {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      const data = await apiFetch("/auth/verify-registration", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });

      login(data.token);
      setCode("");
      onClose();
    } catch (err) {
      const firstError = err.errors ? Object.values(err.errors)[0]?.[0] : null;
      setError(firstError || err.message || t("auth.error"));
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError(null);
    setInfo(null);

    try {
      await apiFetch("/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email, type: "register" }),
      });
      setInfo(t("auth.resent"));
    } catch (err) {
      setError(err.message || t("auth.error"));
    }
  }

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} titleId="otp-modal-title">
      <div className="pt-2 text-center">
        <h2 id="otp-modal-title" className="text-xl font-semibold text-foreground">
          {t("auth.otpTitle")}
        </h2>
        <p className="mt-2 text-sm text-zinc-500">{t("auth.otpSubtitle")}</p>
        <p className="mt-1 text-sm font-medium text-foreground">{email}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label
            htmlFor="otp-code"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            {t("auth.otpCode")}
          </label>
          <input
            id="otp-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            maxLength={6}
            value={code}
            onChange={(event) =>
              setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="______"
            className={inputClasses}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {info && <p className="text-sm text-[#2F7A4E]">{info}</p>}

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="mt-2 h-12 w-full cursor-pointer rounded-full bg-brand-primary text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover disabled:cursor-default disabled:opacity-60"
        >
          {loading ? t("common.loading") : t("auth.verify")}
        </button>

        <div className="flex items-center justify-between text-sm text-zinc-500">
          <button
            type="button"
            onClick={handleResend}
            className="cursor-pointer font-medium text-brand-primary hover:underline"
          >
            {t("auth.resend")}
          </button>

          <button
            type="button"
            onClick={onSwitchToLogin}
            className="cursor-pointer hover:underline"
          >
            {t("auth.backToLogin")}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
