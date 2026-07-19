import CartLink from "@/components/layout/CartLink";
import LanguageDropdown from "@/components/layout/LanguageDropdown";
import LoginButton from "@/components/layout/LoginButton";

export default function HeaderActions() {
  return (
    <div className="hidden items-center gap-3 lg:flex">
      <CartLink />

      <LanguageDropdown />

      <LoginButton />
    </div>
  );
}
