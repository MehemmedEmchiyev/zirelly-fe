"use client";

import Image from "next/image";
import Link from "next/link";
import cartIcon from "@/assets/images/header/cart.svg";
import { useAuth } from "@/context/AuthContext";

export default function CartLink({ onNavigate }) {
  const { isLoggedIn, openAuth } = useAuth();

  function handleClick(event) {
    if (!isLoggedIn) {
      event.preventDefault();
      openAuth();
    }

    onNavigate?.();
  }

  return (
    <Link
      href="/cart"
      aria-label="Cart"
      onClick={handleClick}
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
  );
}
