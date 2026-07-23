import { cookies } from "next/headers";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { DEFAULT_LANGUAGE } from "@/constants/translations";

// Server-də (generateMetadata və s.) seçilmiş dili cookie-dən oxuyur
export async function getServerLang() {
  try {
    const store = await cookies();
    return store.get(STORAGE_KEYS.LANGUAGE)?.value || DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}
