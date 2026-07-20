"use client";

import Image from "next/image";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import emptyStarIcon from "@/assets/images/testimonials/EmptyStar.svg";
import starIcon from "@/assets/images/testimonials/Star.svg";
import { useLanguage } from "@/context/LanguageContext";

import "swiper/css";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <Image
          key={index}
          src={index < rating ? starIcon : emptyStarIcon}
          alt=""
          width={24}
          height={24}
          className="h-6 w-6"
        />
      ))}
    </div>
  );
}

function TestimonialCard({ text, name, rating, avatar }) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-[40px] border border-[var(--content-secondary-inverse)] bg-[var(--content-secondary-inverse,#F3F3F3)] p-6">
      <p className="flex-1 text-base font-normal leading-5 text-foreground">
        {text}
      </p>

      <div className="h-px w-full bg-[var(--background-tertiary,#EBEBEB)]" />

      <div className="flex items-center gap-3">
        {avatar ? (
          <Image
            src={avatar}
            alt={name}
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="h-12 w-12 shrink-0 rounded-full bg-[linear-gradient(135deg,#d4d4d4_25%,#e5e5e5_25%,#e5e5e5_50%,#d4d4d4_50%,#d4d4d4_75%,#e5e5e5_75%)] bg-[length:8px_8px]" />
        )}

        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold leading-5 text-foreground">
            {name}
          </p>
          <StarRating rating={rating} />
        </div>
      </div>
    </article>
  );
}

export default function TestimonialsSection({ title, items }) {
  const { t } = useLanguage();

  if (!items?.length) {
    return null;
  }

  const slides = items.map((item) => ({
    id: item.id,
    text: item.comment,
    name: item.name,
    rating: item.rating,
    avatar: item.image?.url ?? null,
  }));

  return (
    <section className="w-full overflow-hidden px-4 py-10 sm:px-6 sm:py-16 lg:px-[108px] lg:py-20">
      <div className="mx-auto max-w-[1224px]">
        <h2 className="mb-8 text-center text-2xl font-bold leading-8 text-foreground sm:mb-10 sm:text-[32px] sm:leading-10">
          {title || t("home.testimonialsTitle")}
        </h2>

        <Swiper
          modules={[Autoplay]}
          loop
          speed={700}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          spaceBetween={16}
          slidesPerView={1.15}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
          className="testimonials-swiper !overflow-visible"
        >
          {slides.map((item) => (
            <SwiperSlide key={item.id} className="!h-auto">
              <TestimonialCard
                text={item.text}
                name={item.name}
                rating={item.rating}
                avatar={item.avatar}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
