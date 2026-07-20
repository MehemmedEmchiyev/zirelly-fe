"use client";

import { useState } from "react";
import ModalShell from "@/components/layout/ModalShell";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/utils/api";

const inputClasses =
  "h-12 w-full rounded-xl border border-[var(--content-secondary-inverse)] bg-white px-4 text-sm text-foreground outline-none transition-colors placeholder:text-zinc-400 focus:border-brand-primary";

const initialForm = {
  name: "",
  surname: "",
  phone: "",
  birth_date: "",
  email: "",
  password: "",
  password_confirmation: "",
};

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      login(data.token);
      onClose();
    } catch (err) {
      const firstError = err.errors ? Object.values(err.errors)[0]?.[0] : null;
      setError(
        err.status
          ? firstError || err.message
          : t("auth.registerError"),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      titleId="register-modal-title"
      maxWidthClass="max-w-[560px]"
    >
      <div className="pt-2 text-center">
        <h2
          id="register-modal-title"
          className="text-xl font-semibold text-foreground"
        >
          {t("auth.registerTitle")}
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          {t("auth.registerSubtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="min-w-0 flex-1">
              <label
                htmlFor="register-name"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                {t("auth.name")}
              </label>
              <input
                id="register-name"
                type="text"
                required
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className={inputClasses}
              />
            </div>

            <div className="min-w-0 flex-1">
              <label
                htmlFor="register-surname"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                {t("auth.surname")}
              </label>
              <input
                id="register-surname"
                type="text"
                required
                value={form.surname}
                onChange={(event) => updateField("surname", event.target.value)}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="min-w-0 flex-1">
              <label
                htmlFor="register-phone"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                {t("auth.phone")}
              </label>
              <input
                id="register-phone"
                type="tel"
                required
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="+994501234567"
                className={inputClasses}
              />
            </div>

            <div className="min-w-0 flex-1">
              <label
                htmlFor="register-birth-date"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                {t("auth.birthDate")}
              </label>
              <input
                id="register-birth-date"
                type="date"
                required
                value={form.birth_date}
                onChange={(event) =>
                  updateField("birth_date", event.target.value)
                }
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              {t("auth.email")}
            </label>
            <input
              id="register-email"
              type="email"
              required
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="example@gmail.com"
              className={inputClasses}
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="min-w-0 flex-1">
              <label
                htmlFor="register-password"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                {t("auth.password")}
              </label>
              <input
                id="register-password"
                type="password"
                required
                value={form.password}
                onChange={(event) =>
                  updateField("password", event.target.value)
                }
                placeholder="****************"
                className={inputClasses}
              />
            </div>

            <div className="min-w-0 flex-1">
              <label
                htmlFor="register-password-confirmation"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                {t("auth.passwordConfirm")}
              </label>
              <input
                id="register-password-confirmation"
                type="password"
                required
                value={form.password_confirmation}
                onChange={(event) =>
                  updateField("password_confirmation", event.target.value)
                }
                placeholder="****************"
                className={inputClasses}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 h-12 w-full cursor-pointer rounded-full bg-brand-primary text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover disabled:cursor-default disabled:opacity-60"
          >
            {loading ? t("common.loading") : t("auth.registerSubmit")}
          </button>

          <p className="text-center text-sm text-zinc-500">
            {t("auth.haveAccount")}{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="cursor-pointer font-medium text-brand-primary hover:underline"
            >
              {t("auth.loginLink")}
            </button>
          </p>
        </form>
    </ModalShell>
  );
}
