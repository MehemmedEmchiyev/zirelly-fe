"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export default function BannerSection({ banner }) {
  const { t } = useLanguage();

  if (!banner?.image?.url) {
    return null;
  }

  const image = banner.image.url;
  const buttonText = banner.button_text || t("home.seeAllProducts");
  const buttonHref = banner.link || "/products";

  return (
    <section className="w-full px-4 py-10 sm:px-6 sm:py-16 lg:px-[108px] lg:py-20">
      {/* Mobile layout — full-bleed image with overlays */}
      <div className="relative mx-auto flex min-h-[520px] max-w-[1224px] flex-col justify-between overflow-hidden rounded-[40px] p-6 lg:hidden">
        <Image
          src={image}
          alt=""
          fill
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/20" />

        <p className="relative z-10 text-lg font-[590] leading-6 text-white sm:text-2xl sm:leading-8">
          {t("home.bannerText1")}
        </p>

        <Button href={buttonHref} className="relative z-10 w-full">
          {buttonText}
        </Button>
      </div>

      {/* Desktop layout */}
      <div className="relative mx-auto hidden min-h-[560px] max-w-[1224px] flex-col justify-between overflow-hidden rounded-[40px] bg-[#8F7A66] p-10 lg:flex">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={image}
            alt=""
            fill
            quality={90}
            sizes="(max-width: 1024px) 100vw, 1224px"
            className="object-cover object-center"
          />
        </div>

        <p className="relative z-10 ml-auto max-w-[400px] text-left text-xl font-[590] leading-8 text-white">
          {t("home.bannerText1")}
        </p>

        <div className="relative z-10 mt-auto flex items-end justify-between gap-8 pt-16">
          <p className="max-w-[400px] text-xl font-[590] leading-8 text-white">
            {t("home.bannerText2")}
          </p>

          <Button href={buttonHref} className="shrink-0">
            {buttonText}
          </Button>
        </div>
      </div>
    </section>
  );
}
