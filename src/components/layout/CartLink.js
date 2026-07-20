"use client";

import Image from "next/image";
import Link from "next/link";
import cartIcon from "@/assets/images/header/cart.svg";
import { useAuth } from "@/context/AuthContext";
import { useBasket } from "@/context/BasketContext";

export default function CartLink({ onNavigate }) {
  const { isLoggedIn, openAuth } = useAuth();
  const { count } = useBasket();

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
      className="relative flex h-11 w-11 shrink-0 items-center justify-center"
    >
      <Image
        src={cartIcon}
        alt=""
        width={48}
        height={48}
        className="h-11 w-11"
      />

      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-primary px-1 text-[11px] font-semibold leading-none text-white ring-2 ring-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
