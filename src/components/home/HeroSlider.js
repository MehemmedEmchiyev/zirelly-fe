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
      className="hero-swiper w-full overflow-hidden rounded-3xl"
    >
      {heroSlides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="relative  sm:flex  sm:items-center min-h-[80vh]">
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

            <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-10 px-4 pb-4 sm:static sm:w-full sm:gap-6 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
              <h1 className="max-w-[640px]  font-semibold md:font-bold   text-white sm:text-[32px] md:leading-[40px]">
                {slide.title}
              </h1>

              <Link
                href={slide.buttonHref}
                className="w-full -mb-2 md:w-max rounded-full bg-[var(--content-brand,#755C44)] px-6 py-4 text-center text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover sm:w-auto sm:bg-brand-primary"
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
