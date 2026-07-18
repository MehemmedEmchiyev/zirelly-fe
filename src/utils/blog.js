import { DATE_LOCALES, DEFAULT_LANGUAGE } from "@/constants/translations";

export function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatDate(iso, language = DEFAULT_LANGUAGE) {
  if (!iso) return "";

  return new Intl.DateTimeFormat(
    DATE_LOCALES[language] ?? DATE_LOCALES[DEFAULT_LANGUAGE],
    { day: "numeric", month: "long", year: "numeric" },
  ).format(new Date(iso));
}
