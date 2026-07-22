"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/utils/api";
import { isValidPhone } from "@/utils/validation";

const MESSAGE_LIMIT = 500;

function MailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="2.75"
        y="4.75"
        width="18.5"
        height="14.5"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3.5 7L10.76 12.53C11.49 13.09 12.51 13.09 13.24 12.53L20.5 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="text-[12px] font-semibold leading-[18px] text-[#333333]">
        {label}
      </span>
      {children}
      {error && <span className="text-[12px] leading-4 text-red-600">{error}</span>}
    </div>
  );
}

const inputClasses =
  "h-11 w-full rounded-xl border border-[#CCCCCC] bg-white px-4 text-[14px] leading-5 text-foreground outline-none transition-colors placeholder:text-[#666666] focus:border-brand-primary";

const inputErrorClasses =
  "h-11 w-full rounded-xl border border-red-500 bg-white px-4 text-[14px] leading-5 text-foreground outline-none transition-colors placeholder:text-[#666666] focus:border-red-500";

export default function ContactPage() {
  const { language, t } = useLanguage();
  const [contact, setContact] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    apiFetch("/contact", { lang: language })
      .then((response) => {
        if (cancelled) return;
        setContact(response.data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [language]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const next = {};
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (form.name.trim().length < 2) next.name = t("contact.errName");
    if (!EMAIL_RE.test(form.email.trim())) next.email = t("contact.errEmail");
    if (form.phone && !isValidPhone(form.phone))
      next.phone = t("auth.phoneInvalid");
    if (!form.subject) next.subject = t("contact.errSubject");
    if (form.message.trim().length < 10) next.message = t("contact.errMessage");

    return next;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(null);

    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    setErrors({});
    setSending(true);

    try {
      await apiFetch("/contact/messages", {
        method: "POST",
        lang: language,
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          subject: form.subject || undefined,
          message: form.message,
        }),
      });

      setStatus({ ok: true, text: t("contact.success") });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setErrors({});
    } catch (err) {
      setStatus({
        ok: false,
        text: err.status ? err.message : t("contact.error"),
      });
    } finally {
      setSending(false);
    }
  }

  const categories = [
    { value: "general", label: t("contact.catGeneral") },
    { value: "order", label: t("contact.catOrder") },
    { value: "product", label: t("contact.catProduct") },
    { value: "other", label: t("contact.catOther") },
  ];

  return (
    <section className="mx-auto w-full px-4 pb-20 pt-6 sm:px-6 lg:px-[108px] lg:pt-16">
      <div className="mx-auto flex w-full max-w-[1224px] flex-col gap-10 lg:flex-row lg:gap-[61px]">
        <div className="flex w-full flex-col justify-between gap-8 lg:min-h-[256px] lg:w-[496px] lg:shrink-0 lg:gap-0">
          <p className="text-[14px] font-medium leading-5 text-[#666666]">
            {t("contact.label")}
          </p>

          <h1 className="text-[28px] font-medium leading-9 text-foreground sm:text-[52px] sm:leading-[60px] lg:text-[64px] lg:leading-[72px]">
            {contact?.title || (
              <>
                {t("contact.title1")}
                <br />
                {t("contact.title2")}
              </>
            )}
          </h1>

          <div className="text-base leading-5 text-foreground">
            <p>{contact?.subtitle || t("contact.still")}</p>
            <p>
              {t("contact.contactAt")}
              <Link
                href={contact?.email ? `mailto:${contact.email}` : "/"}
                className="text-brand-primary"
              >
                {contact?.email || "Zirelly.az"}
              </Link>
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full min-w-0 flex-col gap-5"
        >
          <div className="flex flex-col gap-5 sm:flex-row">
            <Field label={t("contact.fullName")} error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className={errors.name ? inputErrorClasses : inputClasses}
              />
            </Field>

            <Field label={t("contact.email")} error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                className={errors.email ? inputErrorClasses : inputClasses}
              />
            </Field>

            <Field label={t("contact.number")} error={errors.phone}>
              <input
                type="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="+994501234567"
                className={errors.phone ? inputErrorClasses : inputClasses}
              />
            </Field>
          </div>

          <Field label={t("contact.subject")} error={errors.subject}>
            <select
              value={form.subject}
              onChange={(event) => updateField("subject", event.target.value)}
              className={`${errors.subject ? inputErrorClasses : inputClasses} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M5.5%208l4.5%204.5L14.5%208%22%20stroke%3D%22%231a1a1a%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat pr-10 ${
                form.subject ? "" : "text-[#666666]"
              }`}
            >
              <option value="">{t("contact.chooseCategory")}</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t("contact.helpLabel")} error={errors.message}>
            <div className="relative w-full">
              <textarea
                value={form.message}
                maxLength={MESSAGE_LIMIT}
                onChange={(event) => updateField("message", event.target.value)}
                placeholder={t("contact.yourQuestion")}
                className={`h-[120px] w-full resize-none rounded-2xl border bg-white p-3 text-[14px] leading-5 text-foreground outline-none transition-colors placeholder:text-[#666666] ${
                  errors.message
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#CCCCCC] focus:border-brand-primary"
                }`}
              />
              <span className="pointer-events-none absolute bottom-3 left-3 text-[10px] leading-[14px] text-[#666666]">
                {form.message.length}/{MESSAGE_LIMIT}
              </span>
            </div>
          </Field>

          {status && (
            <p
              className={`text-sm ${status.ok ? "text-[#2F7A4E]" : "text-red-600"}`}
            >
              {status.text}
            </p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="flex h-12 w-fit cursor-pointer items-center gap-2 rounded-3xl bg-brand-primary px-4 text-base font-medium leading-5 text-white transition-colors hover:bg-brand-primary-hover disabled:cursor-default disabled:opacity-60"
          >
            <MailIcon />
            {sending ? t("common.loading") : t("contact.send")}
          </button>
        </form>
      </div>
    </section>
  );
}
