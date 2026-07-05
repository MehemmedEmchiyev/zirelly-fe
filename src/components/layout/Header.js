import Image from "next/image";
import Link from "next/link";
import HeaderActions from "@/components/layout/HeaderActions";
import HeaderMobileMenu from "@/components/layout/HeaderMobileMenu";
import HeaderNav from "@/components/layout/HeaderNav";
import logo from "@/assets/images/header/Logo.svg";

export default function Header() {
  return (
    <header className="w-full pt-6">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-[108px]">
        <div className="mx-auto flex px-4 py-5  w-full max-w-[1224px] items-center justify-between rounded-3xl bg-white  shadow-[0px_0px_4px_0px_#00000014,0px_4px_8px_0px_#0000001A] sm:px-10">
          <Link href="/" className="shrink-0">
            <Image
              src={logo}
              alt="Zirelly"
              priority
              className="h-[20px] w-auto"
            />
          </Link>

          <HeaderNav />
          <HeaderActions />
          <HeaderMobileMenu />
        </div>
      </div>
    </header>
  );
}
