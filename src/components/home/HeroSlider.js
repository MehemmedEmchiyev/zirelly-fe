"use client";

import Image from "next/image";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

import "swiper/css";
import "swiper/css/pagination";

export default function HeroSlider({ slides }) {
  const { t } = useLanguage();

  if (!slides?.length) {
    return null;
  }

  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      speed={600}
      loop={slides.length > 1}
      className="hero-swiper w-full overflow-hidden rounded-3xl"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={slide.id}>
          <div className="relative min-h-[420px] sm:flex sm:min-h-[520px] sm:items-center lg:min-h-[600px]">
            {slide.image?.url ? (
              <Image
                src={slide.image.url}
                alt=""
                fill
                priority={index === 0}
                quality={90}
                sizes="(max-width: 1024px) 100vw, 1224px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#e5e5e5_25%,#f5f5f5_25%,#f5f5f5_50%,#e5e5e5_50%,#e5e5e5_75%,#f5f5f5_75%)] bg-[length:32px_32px]" />
            )}

            <div className="absolute inset-0 z-10 flex flex-col justify-between gap-6 px-5 pb-12 pt-6 sm:static sm:w-full sm:justify-center sm:px-10 sm:py-14 lg:px-16 lg:py-16">
              {slide.title && (
                <h1 className="max-w-[280px] text-[18px] font-semibold leading-6 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)] sm:max-w-[520px] sm:text-[32px] sm:drop-shadow-none md:font-bold md:leading-[40px]">
                  {slide.title}
                </h1>
              )}

              {!slide.hide_button && (
                <Button
                  href={slide.link || "/products"}
                  className="w-full sm:mt-6 sm:w-auto md:w-max"
                >
                  {slide.button_text || t("home.seeProducts")}
                </Button>
              )}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
