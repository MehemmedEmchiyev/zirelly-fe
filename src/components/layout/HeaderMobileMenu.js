"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import logo from "@/assets/images/header/Logo.svg";
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

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 2L14 14M14 2L2 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function HeaderMobileMenu() {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();
  const pathname = usePathname();
  const unmountTimer = useRef(null);

  // Səhifə dəyişəndə menyu həmişə bağlanır
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      clearTimeout(unmountTimer.current);
      setIsMounted(true);
      document.body.style.overflow = "hidden";

      let inner = 0;
      const frame = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setIsVisible(true));
      });

      function handleEscape(event) {
        if (event.key === "Escape") setIsOpen(false);
      }

      document.addEventListener("keydown", handleEscape);

      return () => {
        cancelAnimationFrame(frame);
        cancelAnimationFrame(inner);
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleEscape);
      };
    }

    setIsVisible(false);
    document.body.style.overflow = "";

    unmountTimer.current = setTimeout(() => setIsMounted(false), 300);

    return () => clearTimeout(unmountTimer.current);
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
            className={`fixed inset-0 z-40 bg-black/35 transition-opacity duration-300 ease-out ${
              isVisible ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            onClick={() => setIsOpen(false)}
          />

          <aside
            aria-hidden={!isOpen}
            className={`fixed inset-y-0 right-0 z-50 flex h-full w-[82%] max-w-[340px] flex-col bg-white shadow-[0px_0px_24px_0px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out ${
              isVisible ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between border-b border-header-border px-5 py-5">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Image src={logo} alt="Zirelly" className="h-5 w-auto" />
              </Link>

              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-header-icon-bg text-foreground transition-colors hover:bg-[#e8e8e8]"
              >
                <CloseIcon />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-3 py-3 text-base leading-6 text-foreground transition-colors hover:bg-header-icon-bg"
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </nav>

            <div className="flex items-center justify-between gap-3 border-t border-header-border px-5 py-5">
              <div className="flex items-center gap-2">
                <CartLink onNavigate={() => setIsOpen(false)} />

                <LanguageDropdown />
              </div>

              <LoginButton />
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
