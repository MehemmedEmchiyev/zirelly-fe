"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const navLinks = [
  { href: "/about", labelKey: "nav.about" },
  { href: "/products", labelKey: "nav.products" },
  { href: "/blogs", labelKey: "nav.blogs" },
  { href: "/contact", labelKey: "nav.contact" },
];

export default function HeaderNav() {
  const { t } = useLanguage();

  return (
    <nav className="hidden items-center gap-10 lg:flex">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="font-normal text-foreground transition-colors hover:text-brand-primary"
        >
          {t(link.labelKey)}
        </Link>
      ))}
    </nav>
  );
}
