"use client";

import { useState } from "react";
import { ProfileCalendarIcon } from "@/components/profile/ProfileIcons";

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

export default function ProfileForm() {
  const [form, setForm] = useState({
    name: "Ajdar",
    surname: "Kalbiyev",
    number: "+994 50 500 500",
    birthDate: "04.12.1998",
    email: "ajdarkalbiyev@gmail.com",
  });

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      <div className="hidden rounded-xl bg-header-icon-bg px-4 py-3 lg:block">
        <h1 className="text-base font-bold leading-5 text-foreground">Profile</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-10 rounded-xl bg-header-icon-bg px-4 py-5"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-10">
          <Field label="Name">
            <input
              type="text"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Name"
              className={inputClasses}
            />
          </Field>

          <Field label="Surname">
            <input
              type="text"
              value={form.surname}
              onChange={(event) => updateField("surname", event.target.value)}
              placeholder="Surname"
              className={inputClasses}
            />
          </Field>

          <Field label="Number">
            <input
              type="tel"
              value={form.number}
              onChange={(event) => updateField("number", event.target.value)}
              placeholder="+994 __ ___ __ __"
              className={inputClasses}
            />
          </Field>

          <Field label="Birth Date">
            <div className="relative flex items-center gap-5">
              <input
                type="text"
                value={form.birthDate}
                onChange={(event) => updateField("birthDate", event.target.value)}
                placeholder="DD.MM.YYYY"
                className={`${inputClasses} pr-12`}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]">
                <ProfileCalendarIcon />
              </span>
            </div>
          </Field>

          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="Email"
              className={inputClasses}
            />
          </Field>
        </div>

        <button
          type="submit"
          className="inline-flex w-max cursor-pointer items-center justify-center gap-2 rounded-[24px] border border-[var(--background-brand,#755C44)] bg-[var(--background-brand,#755C44)] px-4 py-3 text-sm font-normal leading-5 text-white transition-colors hover:bg-brand-primary-hover"
        >
          Save
        </button>
      </form>
    </div>
  );
}
