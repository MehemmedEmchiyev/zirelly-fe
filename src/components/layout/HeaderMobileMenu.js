"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import menuIcon from "@/assets/images/header/Menu.svg";
import CartLink from "@/components/layout/CartLink";
import LanguageDropdown from "@/components/layout/LanguageDropdown";
import LoginButton from "@/components/layout/LoginButton";
import { useLanguage } from "@/context/LanguageContext";

const navLinks = [
  { href: "/about", labelKey: "nav.about" },
  { href: "/products", labelKey: "nav.products" },
  { href: "/blogs", labelKey: "nav.blogs" },
  { href: "/contact", labelKey: "nav.contact" },
];

export default function HeaderMobileMenu() {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen) {
      setIsVisible(false);
      return;
    }

    setIsMounted(true);
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => setIsVisible(true));

    function handleEscape(event) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="shrink-0 cursor-pointer"
      >
        <Image src={menuIcon} alt="" width={40} height={40} className="h-10 w-10" />
      </button>

      {isMounted && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={isOpen ? 0 : -1}
            className={`fixed inset-0 z-40 bg-black/25 transition-opacity duration-300 ease-out ${
              isVisible ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            onClick={() => setIsOpen(false)}
            onTransitionEnd={() => {
              if (!isOpen) setIsMounted(false);
            }}
          />

          <div
            aria-hidden={!isOpen}
            className={`fixed inset-x-4 top-[104px] z-50 origin-top rounded-3xl border border-header-border bg-white p-6 shadow-[0px_0px_4px_0px_#00000014,0px_4px_8px_0px_#0000001A] transition-all duration-300 ease-out ${
              isVisible
                ? "translate-y-0 scale-100 opacity-100"
                : "pointer-events-none -translate-y-3 scale-95 opacity-0"
            }`}
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-3 py-3 text-[15px] text-foreground transition-colors hover:bg-header-icon-bg"
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </nav>

            <div className="mt-6 flex items-center justify-between border-t border-header-border pt-6">
              <div className="flex items-center gap-3">
                <CartLink onNavigate={() => setIsOpen(false)} />

                <LanguageDropdown />
              </div>

              <LoginButton />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
