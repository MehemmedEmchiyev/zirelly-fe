"use client";

import Image from "next/image";
import azerbaijanFlag from "@/assets/images/header/Azerbaijan.svg";
import russianFlag from "@/assets/images/header/Russian.svg";
import { useLanguage } from "@/context/LanguageContext";

const flags = {
  az: azerbaijanFlag,
  ru: russianFlag,
};

export default function LanguageSwitcher() {
  const { language, languages, setLanguage } = useLanguage();

  if (!languages.length) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {languages.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => setLanguage(item.code)}
          aria-pressed={language === item.code}
          className={`flex h-9 cursor-pointer items-center gap-2 rounded-full border px-3 text-sm transition-colors ${
            language === item.code
              ? "border-brand-primary bg-brand-primary text-white"
              : "border-header-border bg-white text-foreground hover:bg-header-icon-bg"
          }`}
        >
          {flags[item.code] && (
            <Image
              src={flags[item.code]}
              alt=""
              width={20}
              height={20}
              className="h-5 w-5 shrink-0 rounded-full"
            />
          )}
          {item.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
