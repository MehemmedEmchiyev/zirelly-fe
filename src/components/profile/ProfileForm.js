"use client";

import { useEffect, useState } from "react";
import { ProfileCalendarIcon } from "@/components/profile/ProfileIcons";
import { useLanguage } from "@/context/LanguageContext";
import { authFetch } from "@/utils/api";
import { isValidPhone, normalizePhone } from "@/utils/validation";

const inputClasses =
  "w-full rounded-xl border border-[#CCCCCC] bg-white py-[14px] pl-4 pr-3 text-sm font-normal leading-5 text-[#666666] outline-none transition-colors placeholder:text-[#666666] focus:border-[var(--background-brand,#755C44)] focus:text-foreground";

function Field({ label, children, className = "" }) {
  return (
    <label className={`flex min-w-0 flex-col gap-1 ${className}`}>
      <span className="text-sm font-normal leading-5 text-foreground">{label}</span>
      {children}
    </label>
  );
}

function FormSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-10">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex flex-col gap-1">
          <div className="h-4 w-20 animate-pulse rounded-full bg-white" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-white" />
        </div>
      ))}
    </div>
  );
}

function userToForm(user) {
  return {
    name: user.name ?? "",
    surname: user.surname ?? "",
    phone: user.phone ?? "",
    birth_date: user.birth_date ? user.birth_date.slice(0, 10) : "",
    email: user.email ?? "",
  };
}

export default function ProfileForm() {
  const { t } = useLanguage();
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    authFetch("/auth/me")
      .then((response) => {
        if (cancelled) return;
        setForm(userToForm(response.data));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(null);

    if (!isValidPhone(form.phone)) {
      setStatus({ ok: false, text: t("auth.phoneInvalid") });
      return;
    }

    setSaving(true);

    try {
      const response = await authFetch("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({ ...form, phone: normalizePhone(form.phone) }),
      });

      setForm(userToForm(response.data));
      setStatus({ ok: true, text: t("profile.saved") });
    } catch (err) {
      const firstError = err.errors ? Object.values(err.errors)[0]?.[0] : null;
      setStatus({
        ok: false,
        text: firstError || err.message || t("profile.error"),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      <div className="hidden rounded-xl bg-header-icon-bg px-4 py-3 lg:block">
        <h1 className="text-base font-bold leading-5 text-foreground">
          {t("profile.title")}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-10 rounded-xl bg-header-icon-bg px-4 py-5"
      >
        {form === null ? (
          <FormSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-10">
            <Field label={t("auth.name")}>
              <input
                type="text"
                required
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className={inputClasses}
              />
            </Field>

            <Field label={t("auth.surname")}>
              <input
                type="text"
                required
                value={form.surname}
                onChange={(event) => updateField("surname", event.target.value)}
                className={inputClasses}
              />
            </Field>

            <Field label={t("contact.number")}>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="+994501234567"
                inputMode="tel"
                className={inputClasses}
              />
            </Field>

            <Field label={t("auth.birthDate")}>
              <div className="relative flex items-center gap-5">
                <input
                  type="date"
                  required
                  value={form.birth_date}
                  onChange={(event) =>
                    updateField("birth_date", event.target.value)
                  }
                  className={`${inputClasses} pr-12 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:opacity-0`}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]">
                  <ProfileCalendarIcon />
                </span>
              </div>
            </Field>

            <Field label={t("auth.email")}>
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                className={inputClasses}
              />
            </Field>
          </div>
        )}

        {status && (
          <p
            className={`-my-5 text-sm ${status.ok ? "text-[#2F7A4E]" : "text-red-600"}`}
          >
            {status.text}
          </p>
        )}

        <button
          type="submit"
          disabled={saving || form === null}
          className="inline-flex w-max cursor-pointer items-center justify-center gap-2 rounded-[24px] border border-[var(--background-brand,#755C44)] bg-[var(--background-brand,#755C44)] px-4 py-3 text-sm font-normal leading-5 text-white transition-colors hover:bg-brand-primary-hover disabled:cursor-default disabled:opacity-60"
        >
          {saving ? t("common.loading") : t("profile.save")}
        </button>
      </form>
    </div>
  );
}
