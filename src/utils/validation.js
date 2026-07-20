const PHONE_PATTERN = /^\+?[0-9]{7,15}$/;

export function normalizePhone(value) {
  return value.replace(/[\s()-]/g, "");
}

export function isValidPhone(value) {
  return PHONE_PATTERN.test(normalizePhone(value));
}
