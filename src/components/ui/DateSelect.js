"use client";

import { useLanguage } from "@/context/LanguageContext";
import { MIN_AGE, MONTHS, daysInMonth, pad2, parseDate } from "@/utils/date";

const baseSelect =
  "h-12 min-w-0 flex-1 cursor-pointer appearance-none rounded-xl border border-[var(--content-secondary-inverse)] bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M5.5%208l4.5%204.5L14.5%208%22%20stroke%3D%22%23999%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[position:right_10px_center] bg-no-repeat px-3 pr-9 text-sm text-foreground outline-none transition-colors focus:border-brand-primary";

export default function DateSelect({ value, onChange, minAge = MIN_AGE }) {
  const { language } = useLanguage();
  const months = MONTHS[language] ?? MONTHS.az;

  const { year, month, day } = parseDate(value);

  const currentYear = new Date().getFullYear();
  const maxYear = currentYear - minAge;
  const minYear = currentYear - 100;
  const years = [];
  for (let y = maxYear; y >= minYear; y -= 1) years.push(y);

  const totalDays = daysInMonth(year || maxYear, month || 1);
  const days = [];
  for (let d = 1; d <= totalDays; d += 1) days.push(d);

  function emit(next) {
    const y = next.year ?? year;
    const m = next.month ?? month;
    let d = next.day ?? day;

    if (!y || !m || !d) {
      onChange("");
      return;
    }

    // Ay dəyişəndə gün həddi aşırsa, düzəlt
    const maxDay = daysInMonth(y, m);
    if (d > maxDay) d = maxDay;

    onChange(`${y}-${pad2(m)}-${pad2(d)}`);
  }

  return (
    <div className="flex gap-2">
      <select
        aria-label="Day"
        value={day || ""}
        onChange={(event) => emit({ day: Number(event.target.value) })}
        className={`${baseSelect} ${day ? "" : "text-[#999]"}`}
      >
        <option value="" disabled>
          {language === "ru" ? "День" : language === "en" ? "Day" : "Gün"}
        </option>
        {days.map((d) => (
          <option key={d} value={d} className="text-foreground">
            {d}
          </option>
        ))}
      </select>

      <select
        aria-label="Month"
        value={month || ""}
        onChange={(event) => emit({ month: Number(event.target.value) })}
        className={`${baseSelect} flex-[1.4] ${month ? "" : "text-[#999]"}`}
      >
        <option value="" disabled>
          {language === "ru" ? "Месяц" : language === "en" ? "Month" : "Ay"}
        </option>
        {months.map((name, index) => (
          <option key={name} value={index + 1} className="text-foreground">
            {name}
          </option>
        ))}
      </select>

      <select
        aria-label="Year"
        value={year || ""}
        onChange={(event) => emit({ year: Number(event.target.value) })}
        className={`${baseSelect} ${year ? "" : "text-[#999]"}`}
      >
        <option value="" disabled>
          {language === "ru" ? "Год" : language === "en" ? "Year" : "İl"}
        </option>
        {years.map((y) => (
          <option key={y} value={y} className="text-foreground">
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
