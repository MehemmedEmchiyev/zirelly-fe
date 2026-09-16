"use client";

import { useEffect, useRef, useState } from "react";
import {
  BAKU,
  BAKU_DISTRICTS,
  CITIES,
} from "@/constants/delivery-locations";

export function SearchableSelect({
  id,
  label,
  required,
  value,
  onChange,
  options,
  t,
  error,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event) {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const filtered = query.trim()
    ? options.filter((option) =>
        option.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : options;

  return (
    <div ref={wrapRef} className="relative flex flex-col gap-1">
      {label && (
        <span className="text-[12px] font-medium leading-4 text-[#333333]">
          {label}
          {required && <span className="text-red-600"> *</span>}
        </span>
      )}

      <button
        id={id}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-11 w-full items-center justify-between rounded-xl border bg-white px-3 text-left text-sm leading-5 transition-colors ${
          error
            ? "border-red-500"
            : "border-header-border focus:border-brand-primary"
        } ${value ? "text-foreground" : "text-zinc-400"}`}
      >
        <span className="truncate">{value || (t ? t("cart.addressSelect") : "Seçin")}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full z-30 mt-1 w-full overflow-hidden rounded-xl border border-header-border bg-white shadow-xl">
          <div className="p-2 border-b border-header-border">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t ? t("cart.addressSearch") : "Axtar..."}
              className="w-full rounded-lg bg-header-icon-bg px-3 py-1.5 text-sm leading-5 text-foreground outline-none placeholder:text-zinc-400"
            />
          </div>
          <ul className="max-h-48 overflow-y-auto py-1">
            {filtered.map((option) => (
              <li key={option}>
                <button
                  id={id ? `${id}-option-${option.replace(/\s+/g, "-")}` : undefined}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`w-full cursor-pointer px-3 py-2 text-left text-sm leading-5 transition-colors hover:bg-header-icon-bg ${
                    option === value
                      ? "font-semibold text-brand-primary"
                      : "text-foreground"
                  }`}
                >
                  {option}
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-sm text-zinc-400">
                {t ? t("cart.addressNoResults") : "Tapılmadı"}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function DeliveryAddressFields({
  values,
  onChange,
  errors = {},
  locations,
  t,
  idPrefix = "addr",
  showNote = true,
}) {
  const cities = locations?.cities?.length ? locations.cities : CITIES;
  const bakuName = locations?.baku || BAKU;
  const bakuDistricts = locations?.baku_districts?.length
    ? locations.baku_districts
    : BAKU_DISTRICTS;

  const isBaku = values.city === bakuName;

  return (
    <div className="flex flex-col gap-3">
      {/* 1. Şəhər / rayon* */}
      <SearchableSelect
        id={`${idPrefix}-city`}
        label={t ? t("cart.addressCity") : "Şəhər / rayon"}
        required
        value={values.city || ""}
        onChange={(city) => {
          onChange("city", city);
          if (city !== bakuName) {
            onChange("district", "");
          }
        }}
        options={cities}
        t={t}
        error={errors.city}
      />

      {/* 2. Bakı seçildikdə İnzibati rayon* */}
      {isBaku && (
        <SearchableSelect
          id={`${idPrefix}-district`}
          label={t ? t("cart.addressDistrict") : "İnzibati rayon"}
          required
          value={values.district || ""}
          onChange={(district) => onChange("district", district)}
          options={bakuDistricts}
          t={t}
          error={errors.district}
        />
      )}

      {/* 3. Küçə / prospekt / qəsəbə* */}
      <div className="flex flex-col gap-1">
        <span className="text-[12px] font-medium leading-4 text-[#333333]">
          {t ? t("cart.addressStreet") : "Küçə / prospekt / qəsəbə"}
          <span className="text-red-600"> *</span>
        </span>
        <input
          id={`${idPrefix}-street`}
          type="text"
          value={values.street || ""}
          onChange={(e) => onChange("street", e.target.value)}
          placeholder={
            t
              ? t("cart.addressStreetPlaceholder")
              : "Məs.: Qaçaq Nəbi küçəsi"
          }
          className={`h-11 w-full rounded-xl border bg-white px-3 text-sm leading-5 text-foreground outline-none transition-colors placeholder:text-zinc-400 ${
            errors.street
              ? "border-red-500"
              : "border-header-border focus:border-brand-primary"
          }`}
        />
      </div>

      {/* 4. Ev / bina №* və 5. Mənzil № */}
      <div className="flex gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-[12px] font-medium leading-4 text-[#333333]">
            {t ? t("cart.addressBuilding") : "Ev / bina №"}
            <span className="text-red-600"> *</span>
          </span>
          <input
            id={`${idPrefix}-building`}
            type="text"
            value={values.building || ""}
            onChange={(e) => onChange("building", e.target.value)}
            placeholder={
              t ? t("cart.addressBuildingPlaceholder") : "Məs.: 9A"
            }
            className={`h-11 w-full rounded-xl border bg-white px-3 text-sm leading-5 text-foreground outline-none transition-colors placeholder:text-zinc-400 ${
              errors.building
                ? "border-red-500"
                : "border-header-border focus:border-brand-primary"
            }`}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-[12px] font-medium leading-4 text-[#333333]">
            {t ? t("cart.addressApartment") : "Mənzil №"}
          </span>
          <input
            id={`${idPrefix}-apartment`}
            type="text"
            value={values.apartment || ""}
            onChange={(e) => onChange("apartment", e.target.value)}
            placeholder="Məs.: 24"
            className="h-11 w-full rounded-xl border border-header-border bg-white px-3 text-sm leading-5 text-foreground outline-none transition-colors placeholder:text-zinc-400 focus:border-brand-primary"
          />
        </div>
      </div>

      {/* 6. Əlavə qeyd */}
      {showNote && (
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-medium leading-4 text-[#333333]">
            {t ? t("cart.addressNote") : "Əlavə qeyd"}
          </span>
          <textarea
            id={`${idPrefix}-note`}
            rows={2}
            value={values.note || ""}
            onChange={(e) => onChange("note", e.target.value)}
            placeholder={
              t
                ? t("cart.addressNotePlaceholder")
                : "Məs.: 2-ci blok, 5-ci mərtəbə, domofon işləmir və s."
            }
            className="w-full rounded-xl border border-header-border bg-white px-3 py-2 text-sm leading-5 text-foreground outline-none transition-colors placeholder:text-zinc-400 focus:border-brand-primary"
          />
        </div>
      )}
    </div>
  );
}
