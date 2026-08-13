const AZ_PHONE_PATTERN = /^\+994(10|50|51|55|60|70|77|99)[0-9]{7}$/;

export function normalizePhone(value) {
  let digits = String(value).replace(/[\s().-]/g, "");

  if (digits.startsWith("+")) {
    digits = digits.slice(1);
  }

  if (!/^[0-9]+$/.test(digits)) {
    return String(value).trim();
  }

  if (digits.startsWith("994") && digits.length === 12) {
    digits = digits.slice(3);
  } else if (digits.startsWith("0") && digits.length === 10) {
    digits = digits.slice(1);
  }

  return `+${digits.length === 9 ? `994${digits}` : digits}`;
}

export function isValidPhone(value) {
  return AZ_PHONE_PATTERN.test(normalizePhone(value));
}
