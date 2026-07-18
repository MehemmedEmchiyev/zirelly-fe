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
          <div className="relative min-h-[88vh] sm:flex sm:items-center">
            {slide.image?.url ? (
              <Image
                src={slide.image.url}
                alt=""
                fill
                priority={index === 0}
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#e5e5e5_25%,#f5f5f5_25%,#f5f5f5_50%,#e5e5e5_50%,#e5e5e5_75%,#f5f5f5_75%)] bg-[length:32px_32px]" />
            )}

            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-10 px-4 pb-4 sm:static sm:w-full sm:gap-6 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
              <h1 className="max-w-[640px]  font-semibold md:font-bold   text-white sm:text-[32px] md:leading-[40px]">
                {slide.title}
              </h1>

              <Button
                href={slide.link || "/products"}
                className="w-full -mb-2 md:w-max sm:w-auto"
              >
                {slide.button_text || t("home.seeProducts")}
              </Button>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
