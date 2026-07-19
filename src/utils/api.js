import { STORAGE_KEYS } from "@/constants/storage-keys";
import { getAuthToken } from "@/utils/auth";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.zirelly.az/api";

export function getStoredLanguage() {
  if (typeof window === "undefined") return "az";
  return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || "az";
}

async function request(path, { lang, ...options } = {}, extraHeaders = {}) {
  const url = new URL(`${API_URL}${path}`);

  if (lang) {
    url.searchParams.set("lang", lang);
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Language": lang || getStoredLanguage(),
      ...extraHeaders,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message || `API request failed: ${response.status}`,
    );
    error.status = response.status;
    error.errors = data.errors;
    throw error;
  }

  return data;
}

export function apiFetch(path, options) {
  return request(path, options);
}

export function authFetch(path, options) {
  return request(path, options, {
    Authorization: `Bearer ${getAuthToken()}`,
  });
}
