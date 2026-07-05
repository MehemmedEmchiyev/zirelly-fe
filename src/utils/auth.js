import { STORAGE_KEYS } from "@/constants/storage-keys";

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}
