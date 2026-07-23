"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_LANGUAGE,
  TRANSLATIONS,
} from "@/constants/translations";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { apiFetch } from "@/utils/api";

const LanguageContext = createContext(null);

function writeLanguageCookie(code) {
  // 1 il, bütün yollarda — server generateMetadata bunu oxuyur
  document.cookie = `${STORAGE_KEYS.LANGUAGE}=${code}; path=/; max-age=31536000; SameSite=Lax`;
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (stored && TRANSLATIONS[stored]) {
      setLanguageState(stored);
      writeLanguageCookie(stored);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    apiFetch("/languages")
      .then(({ data }) => {
        if (cancelled) return;
        setLanguages(
          data
            .filter((item) => item.is_active)
            .sort((a, b) => a.position - b.position),
        );
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const setLanguage = useCallback((code) => {
    setLanguageState(code);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, code);
    writeLanguageCookie(code);
  }, []);

  const t = useCallback(
    (key) =>
      TRANSLATIONS[language]?.[key] ??
      TRANSLATIONS[DEFAULT_LANGUAGE][key] ??
      key,
    [language],
  );

  const value = useMemo(
    () => ({ language, languages, setLanguage, t }),
    [language, languages, setLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
