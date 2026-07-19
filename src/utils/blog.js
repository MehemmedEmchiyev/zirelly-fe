import { DATE_LOCALES, DEFAULT_LANGUAGE } from "@/constants/translations";

export function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const AZ_MONTHS = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avqust",
  "sentyabr",
  "oktyabr",
  "noyabr",
  "dekabr",
];

export function formatDate(iso, language = DEFAULT_LANGUAGE) {
  if (!iso) return "";

  const date = new Date(iso);

  if (language === "az") {
    return `${date.getDate()} ${AZ_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  }

  return new Intl.DateTimeFormat(
    DATE_LOCALES[language] ?? DATE_LOCALES[DEFAULT_LANGUAGE],
    { day: "numeric", month: "long", year: "numeric" },
  ).format(date);
}
