"use client";

import Image from "next/image";
import Link from "next/link";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { heroSlides } from "@/data/hero-slides";

import "swiper/css";
import "swiper/css/pagination";

export default function HeroSlider() {
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
      loop
      className="hero-swiper w-full overflow-hidden rounded-[40px]"
    >
      {heroSlides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="relative flex min-h-[320px] items-center sm:min-h-[400px] lg:min-h-[480px]">
            {slide.image ? (
              <Image
                src={slide.image}
                alt=""
                fill
                priority={slide.id === 1}
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#e5e5e5_25%,#f5f5f5_25%,#f5f5f5_50%,#e5e5e5_50%,#e5e5e5_75%,#f5f5f5_75%)] bg-[length:32px_32px]" />
            )}

            <div className="absolute inset-0 bg-black/25" />

            <div className="relative z-10 flex w-full flex-col items-start gap-6 px-6 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
              <h1 className="max-w-[640px] text-[28px] font-bold leading-[36px] text-white sm:text-[32px] sm:leading-[40px]">
                {slide.title}
              </h1>

              <Link
                href={slide.buttonHref}
                className="rounded-full bg-brand-primary px-6 py-4 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover"
              >
                {slide.buttonText}
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
