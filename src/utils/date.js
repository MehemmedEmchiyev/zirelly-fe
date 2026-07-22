export const MIN_AGE = 13;

export const MONTHS = {
  az: [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "İyun",
    "İyul",
    "Avqust",
    "Sentyabr",
    "Oktyabr",
    "Noyabr",
    "Dekabr",
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  ru: [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ],
};

export function daysInMonth(year, month) {
  if (!year || !month) return 31;
  return new Date(year, month, 0).getDate();
}

export function pad2(value) {
  return String(value).padStart(2, "0");
}

// "YYYY-MM-DD" → { year, month, day } (rəqəmlər və ya "")
export function parseDate(value) {
  if (!value) return { year: "", month: "", day: "" };
  const [year, month, day] = value.split("-");
  return {
    year: year ? Number(year) : "",
    month: month ? Number(month) : "",
    day: day ? Number(day) : "",
  };
}

export function getAge(value) {
  if (!value) return null;
  const birth = new Date(value);
  if (Number.isNaN(birth.getTime())) return null;

  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age;
}

export function isValidBirthDate(value, minAge = MIN_AGE) {
  const age = getAge(value);
  return age !== null && age >= minAge && age <= 120;
}
