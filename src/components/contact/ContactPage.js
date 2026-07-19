"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { API_URL, apiFetch } from "@/utils/api";

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

function Field({ label, children }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="text-[12px] font-semibold leading-[18px] text-[#333333]">
        {label}
      </span>
      {children}
    </div>
  );
}

const inputClasses =
  "h-11 w-full rounded-xl border border-[#CCCCCC] bg-white px-4 text-[14px] leading-5 text-foreground outline-none transition-colors placeholder:text-[#666666] focus:border-brand-primary";

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
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(null);
    setSending(true);

    try {
      const response = await fetch(`${API_URL}/contact/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          subject: form.subject || undefined,
          message: form.message,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setStatus({ ok: false, text: data.message || t("contact.error") });
        return;
      }

      setStatus({ ok: true, text: t("contact.success") });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatus({ ok: false, text: t("contact.error") });
    } finally {
      setSending(false);
    }
  }

  const categories = [
    t("contact.catGeneral"),
    t("contact.catOrder"),
    t("contact.catProduct"),
    t("contact.catOther"),
  ];

  return (
    <section className="mx-auto w-full px-4 pb-20 pt-16 sm:px-6 lg:px-[108px] lg:pt-[100px]">
      <div className="mx-auto flex w-full max-w-[1224px] flex-col gap-10 lg:flex-row lg:gap-[61px]">
        <div className="flex w-full flex-col justify-between gap-8 lg:min-h-[256px] lg:w-[496px] lg:shrink-0 lg:gap-0">
          <p className="text-[14px] font-medium leading-5 text-[#666666]">
            {t("contact.label")}
          </p>

          <h1 className="text-[40px] font-medium leading-[48px] text-foreground sm:text-[52px] sm:leading-[60px] lg:text-[64px] lg:leading-[72px]">
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
            <Field label={t("contact.fullName")}>
              <input
                type="text"
                required
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className={inputClasses}
              />
            </Field>

            <Field label={t("contact.email")}>
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                className={inputClasses}
              />
            </Field>

            <Field label={t("contact.number")}>
              <input
                type="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className={inputClasses}
              />
            </Field>
          </div>

          <Field label={t("contact.subject")}>
            <select
              value={form.subject}
              onChange={(event) => updateField("subject", event.target.value)}
              className={`${inputClasses} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M5.5%208l4.5%204.5L14.5%208%22%20stroke%3D%22%231a1a1a%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat pr-10 ${
                form.subject ? "" : "text-[#666666]"
              }`}
            >
              <option value="">{t("contact.chooseCategory")}</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t("contact.helpLabel")}>
            <div className="relative w-full">
              <textarea
                required
                value={form.message}
                maxLength={MESSAGE_LIMIT}
                onChange={(event) => updateField("message", event.target.value)}
                placeholder={t("contact.yourQuestion")}
                className="h-[120px] w-full resize-none rounded-2xl border border-[#CCCCCC] bg-white p-3 text-[14px] leading-5 text-foreground outline-none transition-colors placeholder:text-[#666666] focus:border-brand-primary"
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
