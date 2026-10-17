"use client";

import { useState } from "react";
import ModalShell from "@/components/layout/ModalShell";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/utils/api";
import DateSelect from "@/components/ui/DateSelect";
import DeliveryAddressFields from "@/components/common/DeliveryAddressFields";
import { composeDeliveryAddress } from "@/constants/delivery-locations";
import { isValidPhone, normalizePhone } from "@/utils/validation";
import { isValidBirthDate } from "@/utils/date";

const inputClasses =
  "h-12 w-full rounded-xl border border-[var(--content-secondary-inverse)] bg-white px-4 text-sm text-foreground outline-none transition-colors placeholder:text-zinc-400 focus:border-brand-primary";

const initialForm = {
  name: "",
  surname: "",
  phone: "",
  birth_date: "",
  address_city: "Bakı",
  address_district: "",
  address_street: "",
  address_building: "",
  address_apartment: "",
  address_note: "",
  email: "",
  password: "",
  password_confirmation: "",
};

export default function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
  onOtpRequired,
}) {
  const { t } = useLanguage();
  const [form, setForm] = useState(initialForm);
  const [addrErrors, setAddrErrors] = useState({});
  const [error, setError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [loading, setLoading] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handlePhoneChange(value) {
    updateField("phone", value);

    if (phoneError && isValidPhone(value)) {
      setPhoneError(null);
    }
  }

  function handlePhoneBlur() {
    setPhoneError(
      form.phone.trim() !== "" && !isValidPhone(form.phone)
        ? t("auth.phoneInvalid")
        : null,
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!isValidPhone(form.phone)) {
      setPhoneError(t("auth.phoneInvalid"));
      return;
    }

    if (!isValidBirthDate(form.birth_date)) {
      setError(t("auth.birthInvalid"));
      return;
    }

    const aErrors = {};
    if (!form.address_city) aErrors.city = true;
    if (form.address_city === "Bakı" && !form.address_district) aErrors.district = true;
    if (!form.address_street.trim()) aErrors.street = true;
    if (!form.address_building.trim()) aErrors.building = true;
    if (!form.address_note.trim()) aErrors.note = true;

    setAddrErrors(aErrors);

    if (Object.keys(aErrors).length > 0) {
      setError(t("cart.addressFillRequired"));
      return;
    }

    setLoading(true);

    const composedAddress = composeDeliveryAddress({
      city: form.address_city,
      district: form.address_district,
      street: form.address_street.trim(),
      building: form.address_building.trim(),
      apartment: form.address_apartment.trim() || null,
    });

    const savedAddressObj = {
      city: form.address_city,
      district: form.address_city === "Bakı" ? form.address_district : "",
      street: form.address_street.trim(),
      building: form.address_building.trim(),
      apartment: form.address_apartment.trim(),
      note: form.address_note.trim(),
      composed: composedAddress,
    };

    try {
      localStorage.setItem("zirelly_delivery_address", JSON.stringify(savedAddressObj));
    } catch {}

    try {
      const submitted = {
        name: form.name,
        surname: form.surname,
        phone: normalizePhone(form.phone),
        birth_date: form.birth_date,
        address: composedAddress,
        address_city: form.address_city,
        address_district: form.address_city === "Bakı" ? form.address_district : null,
        address_street: form.address_street.trim(),
        address_building: form.address_building.trim(),
        address_apartment: form.address_apartment.trim() || null,
        address_note: form.address_note.trim(),
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
      };

      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(submitted),
      });

      setForm(initialForm);
      setAddrErrors({});
      setError(null);
      onOtpRequired(submitted.email);
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
      name="register"
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
                onChange={(event) => handlePhoneChange(event.target.value)}
                onBlur={handlePhoneBlur}
                placeholder="+994512522410"
                inputMode="tel"
                aria-invalid={phoneError ? true : undefined}
                className={`${inputClasses} ${phoneError ? "border-red-500 focus:border-red-500" : ""}`}
              />
              {phoneError && (
                <p className="mt-1.5 text-xs leading-4 text-red-600">{phoneError}</p>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <label
                htmlFor="register-birth-date"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                {t("auth.birthDate")}
              </label>
              <DateSelect
                value={form.birth_date}
                onChange={(value) => updateField("birth_date", value)}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-header-border bg-header-icon-bg/50 p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">
              {t("cart.deliveryAddress")}
            </p>
            <DeliveryAddressFields
              idPrefix="register-addr"
              values={{
                city: form.address_city,
                district: form.address_district,
                street: form.address_street,
                building: form.address_building,
                apartment: form.address_apartment,
                note: form.address_note,
              }}
              onChange={(field, value) => {
                updateField(`address_${field}`, value);
                setAddrErrors((prev) => ({ ...prev, [field]: false }));
              }}
              errors={addrErrors}
              t={t}
              noteRequired
            />
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
            id="btn-register-submit"
            type="submit"
            disabled={loading}
            className="mt-2 h-12 w-full cursor-pointer rounded-full bg-brand-primary text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover disabled:cursor-default disabled:opacity-60"
          >
            {loading ? t("common.loading") : t("auth.registerSubmit")}
          </button>

          <p className="text-center text-sm text-zinc-500">
            {t("auth.haveAccount")}{" "}
            <button
              id="btn-register-switch-login"
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
