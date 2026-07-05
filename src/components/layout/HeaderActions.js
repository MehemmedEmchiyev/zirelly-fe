import Image from "next/image";
import Link from "next/link";
import LanguageDropdown from "@/components/layout/LanguageDropdown";
import LoginButton from "@/components/layout/LoginButton";
import cartIcon from "@/assets/images/header/cart.svg";

export default function HeaderActions() {
  return (
    <div className="hidden items-center gap-3 lg:flex">
      <Link
        href="/cart"
        aria-label="Cart"
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

      <LoginButton />
    </div>
  );
}
