"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/about", label: "About us" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact us" },
];

function ChevronDownIcon({ className }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 4.5L6 8L9.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HeaderNav() {
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  return (
    <nav className="hidden items-center gap-10 lg:flex">
      {navLinks.slice(0, 1).map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="font-normal text-foreground transition-colors hover:text-brand-primary"
        >
          {link.label}
        </Link>
      ))}

      <div
        className="relative"
        onMouseEnter={() => setIsProductsOpen(true)}
        onMouseLeave={() => setIsProductsOpen(false)}
      >
        <Link
          href="/products"
          className="flex items-center gap-1.5  font-normal text-foreground transition-colors hover:text-brand-primary"
        >
          Products
          <ChevronDownIcon
            className={`transition-transform ${isProductsOpen ? "rotate-180" : ""}`}
          />
        </Link>

        {isProductsOpen && (
          <div className="absolute left-0 top-full z-50 pt-3">
            <div className="min-w-[180px] rounded-2xl border border-header-border bg-white py-2 shadow-lg">
              <Link
                href="/products"
                className="block px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-header-icon-bg"
              >
                All Products
              </Link>
            </div>
          </div>
        )}
      </div>

      {navLinks.slice(1).map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className=" font-normal text-foreground transition-colors hover:text-brand-primary"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
