"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LoginModal from "@/components/layout/LoginModal";
import { isAuthenticated } from "@/utils/auth";

function UserIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="9" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3.5 15.5C3.5 12.5 5.9 10.5 9 10.5C12.1 10.5 14.5 12.5 14.5 15.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function LoginButton({ className = "" }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  if (isLoggedIn) {
    return (
      <Link
        href="/profile"
        className={`flex h-11 items-center gap-2 rounded-full bg-brand-primary px-5 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover ${className}`}
      >
        <UserIcon />
        Profile
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={`flex h-11 cursor-pointer items-center gap-2 rounded-full bg-brand-primary px-5 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover ${className}`}
      >
        <UserIcon />
        Log In
      </button>

      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
