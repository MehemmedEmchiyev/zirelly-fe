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

// URL-dən dil prefiksini oxuyur: /ru/elaqe → "ru", /elaqe → defolt (az)
function languageFromPath(pathname) {
  const segment = pathname.split("/")[1];
  return segment !== DEFAULT_LANGUAGE && TRANSLATIONS[segment]
    ? segment
    : DEFAULT_LANGUAGE;
}

// Prefiksi dəyişərək yeni URL qurur: az prefikssiz, digərləri /ru, /en
function pathWithLanguage(code) {
  const { pathname, search, hash } = window.location;
  const segment = pathname.split("/")[1];
  const bare = TRANSLATIONS[segment]
    ? pathname.slice(segment.length + 1) || "/"
    : pathname;

  const prefixed =
    code === DEFAULT_LANGUAGE ? bare : `/${code}${bare === "/" ? "" : bare}`;

  return `${prefixed}${search}${hash}`;
}

export function LanguageProvider({ children, initialLanguage }) {
  const [language, setLanguageState] = useState(
    TRANSLATIONS[initialLanguage] ? initialLanguage : DEFAULT_LANGUAGE,
  );
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    // URL mənbə sayılır — proxy cookie-yə görə düzgün prefiksə yönləndirir
    const fromPath = languageFromPath(window.location.pathname);
    setLanguageState(fromPath);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, fromPath);
    writeLanguageCookie(fromPath);
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

    // URL prefiksini yenilə (/ru/..., /en/... və ya az üçün prefikssiz) —
    // tam yüklənmə server metadata-nın da yeni dildə gəlməsini təmin edir
    const target = pathWithLanguage(code);
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (target !== current) {
      window.location.assign(target);
    }
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
