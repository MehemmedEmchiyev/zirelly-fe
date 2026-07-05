"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import menuIcon from "@/assets/images/header/Menu.svg";
import cartIcon from "@/assets/images/header/cart.svg";
import LanguageDropdown from "@/components/layout/LanguageDropdown";
import LoginButton from "@/components/layout/LoginButton";

const navLinks = [
  { href: "/about", label: "About us" },
  { href: "/products", label: "Products" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact us" },
];

export default function HeaderMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
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

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-x-4 top-[88px] z-50 rounded-3xl border border-header-border bg-white p-6 shadow-[0px_0px_4px_0px_#00000014,0px_4px_8px_0px_#0000001A]">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-3 py-3 text-[15px] text-foreground transition-colors hover:bg-header-icon-bg"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 flex items-center justify-between border-t border-header-border pt-6">
              <div className="flex items-center gap-3">
                <Link
                  href="/cart"
                  aria-label="Cart"
                  onClick={() => setIsOpen(false)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center"
                >
                  <Image
                    src={cartIcon}
                    alt=""
                    width={48}
                    height={48}
                    className="h-11 w-11"
                  />
                </Link>

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
