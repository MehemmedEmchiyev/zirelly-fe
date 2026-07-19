"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import logo from "@/assets/images/header/Logo.svg";
import facebookIcon from "@/assets/images/footer/facebook.svg";
import instagramIcon from "@/assets/images/footer/instagram.svg";
import linkedinIcon from "@/assets/images/footer/linkedin.svg";
import tiktokIcon from "@/assets/images/footer/tiktok.svg";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/utils/api";

const FALLBACK_PHONE = "+994 (55) 730 00 36";

const learnLinks = [
  { href: "/about", labelKey: "nav.about" },
  { href: "/products", labelKey: "nav.products" },
  { href: "/blogs", labelKey: "nav.blogs" },
  { href: "/contact", labelKey: "nav.contact" },
];

const socialLinks = [
  { href: "#", label: "Facebook", icon: facebookIcon },
  { href: "#", label: "Instagram", icon: instagramIcon },
  { href: "#", label: "TikTok", icon: tiktokIcon },
  { href: "#", label: "LinkedIn", icon: linkedinIcon },
];

export default function Footer() {
  const { t } = useLanguage();
  const [phone, setPhone] = useState(null);

  useEffect(() => {
    let cancelled = false;

    apiFetch("/contact")
      .then((response) => {
        if (cancelled) return;
        setPhone(response.data?.phone || null);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className="mt-auto mb-10 w-full">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-[108px]">
        <div className="mx-auto max-w-[1224px] rounded-[40px] border-t border-[var(--content-secondary-inverse)] bg-[var(--background-primary,#FFFFFF)] py-10 shadow-[0px_0px_4px_0px_#00000014,0px_4px_8px_0px_#0000001A] ">
          <div className="flex flex-col gap-8 px-6 sm:px-10 lg:grid lg:grid-cols-3 lg:gap-16">
            <div className="flex flex-col gap-4">
              <Link href="/" className="shrink-0">
                <Image
                  src={logo}
                  alt="Zirelly"
                  className="h-[20px] w-auto"
                />
              </Link>
              <p className="max-w-[320px] text-sm leading-6 text-zinc-500">
                {t("footer.description")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 lg:contents">
              <div className="flex flex-col justify-between gap-8 lg:min-h-[220px]">
                <div>
                  <h3 className="text-xs font-normal leading-[18px] text-zinc-400">
                    {t("footer.learn")}
                  </h3>
                  <nav className="mt-3 flex flex-col gap-3">
                    {learnLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-xl font-normal leading-6 text-foreground transition-colors hover:text-brand-primary"
                      >
                        {t(link.labelKey)}
                      </Link>
                    ))}
                  </nav>
                </div>

                <div className="hidden text-sm leading-6 text-zinc-500 lg:block">
                  <p>{t("footer.copyright")}</p>
                  <p>{t("footer.rights")}</p>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-8 lg:min-h-[220px]">
                <div>
                  <h3 className="text-xs font-normal leading-[18px] text-zinc-400">
                    {t("footer.socialMedia")}
                  </h3>
                  <div className="mt-3 grid w-fit grid-cols-2 gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        aria-label={social.label}
                        className="shrink-0 transition-opacity hover:opacity-80"
                      >
                        <Image
                          src={social.icon}
                          alt=""
                          width={40}
                          height={40}
                          className="h-10 w-10"
                        />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="hidden text-sm leading-6 text-foreground lg:block">
                  <p>{phone ?? FALLBACK_PHONE}</p>
                  <p>Zirelly.az</p>
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between gap-4 lg:hidden">
              <div className="text-sm leading-6 text-zinc-500">
                <p>{t("footer.copyright")}</p>
                <p>{t("footer.rights")}</p>
              </div>

              <div className="text-right text-sm leading-6 text-foreground">
                <p>{phone ?? FALLBACK_PHONE}</p>
                <p>Zirelly.az</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
