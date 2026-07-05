"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import azerbaijanFlag from "@/assets/images/header/Azerbaijan.svg";
import languageIcon from "@/assets/images/header/language.svg";
import russianFlag from "@/assets/images/header/Russian.svg";

const languages = [
  { code: "az", label: "Azerbaijan", flag: azerbaijanFlag },
  { code: "ru", label: "Russian", flag: russianFlag },
];

export default function LanguageDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("az");
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  function handleSelect(code) {
    setSelected(code);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        aria-label="Change language"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="cursor-pointer mt-1"
      >
        <Image
          src={languageIcon}
          alt=""
          width={48}
          height={48}
          className="h-11 w-11"
        />
      </button>

      <div
        className={`absolute left-1/2 top-full z-50 pt-3 transition-all duration-200 ease-out ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        style={{
          transform: isOpen
            ? "translateX(-50%) translateY(0)"
            : "translateX(-50%) translateY(-8px)",
        }}
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col gap-3 rounded-2xl border border-[var(--content-secondary-inverse)] bg-[var(--content-primary-inverse)] p-3 shadow-[0px_0px_4px_0px_#00000014,0px_4px_8px_0px_#0000001A]">
          {languages.map((language) => (
            <button
              key={language.code}
              type="button"
              onClick={() => handleSelect(language.code)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-1 py-1 text-left text-[15px] text-foreground transition-colors hover:bg-header-icon-bg ${
                selected === language.code ? "bg-header-icon-bg" : ""
              }`}
            >
              <Image
                src={language.flag}
                alt=""
                width={24}
                height={24}
                className="h-6 w-6 shrink-0 rounded-full"
              />
              {language.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
