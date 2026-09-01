import { cookies, headers } from "next/headers";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { DEFAULT_LANGUAGE, TRANSLATIONS } from "@/constants/translations";

// Server-də (generateMetadata və s.) seçilmiş dili oxuyur.
// Əsas mənbə URL prefiksidir (proxy x-locale header-i ilə ötürür),
// ehtiyat olaraq cookie-yə baxılır.
export async function getServerLang() {
  try {
    const headerStore = await headers();
    const fromPath = headerStore.get("x-locale");

    if (fromPath && TRANSLATIONS[fromPath]) {
      return fromPath;
    }
  } catch {
    // headers() əlçatan olmayanda cookie-yə düşür
  }

  try {
    const store = await cookies();
    const stored = store.get(STORAGE_KEYS.LANGUAGE)?.value;

    if (stored && TRANSLATIONS[stored]) {
      return stored;
    }
  } catch {
    // cookie oxunmayanda defolt qalır
  }

  return DEFAULT_LANGUAGE;
}
