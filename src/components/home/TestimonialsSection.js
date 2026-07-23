"use client";

import Image from "next/image";
import emptyStarIcon from "@/assets/images/testimonials/EmptyStar.svg";
import starIcon from "@/assets/images/testimonials/Star.svg";
import { useLanguage } from "@/context/LanguageContext";

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
    <article className="flex h-full w-[300px] shrink-0 flex-col gap-4 rounded-[40px] border border-[var(--content-secondary-inverse)] bg-[var(--content-secondary-inverse,#F3F3F3)] p-6 sm:w-[360px] lg:w-[392px]">
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

  const base = items.map((item) => ({
    id: item.id,
    text: item.comment,
    name: item.name,
    rating: item.rating,
    avatar: item.image?.url ?? null,
  }));

  // Ekranı doldurmaq üçün kifayət qədər kart, sonra fasiləsiz loop üçün iki dəfə
  const filled = [];
  const target = Math.max(base.length, 6);
  for (let i = 0; i < target; i += 1) {
    filled.push({ ...base[i % base.length], key: i });
  }

  const track = [...filled, ...filled];
  const duration = filled.length * 5; // saniyə — kart sayına görə sabit sürət

  return (
    <section className="w-full overflow-hidden py-10 sm:py-16 lg:py-20">
      <h2 className="mb-8 px-4 text-center text-2xl font-bold leading-8 text-foreground sm:mb-10 sm:px-6 sm:text-[32px] sm:leading-10">
        {title || t("home.testimonialsTitle")}
      </h2>

      <div className="testimonials-marquee w-full overflow-hidden">
        <div
          className="testimonials-marquee-track flex w-max gap-5"
          style={{ animationDuration: `${duration}s` }}
        >
          {track.map((item, index) => (
            <TestimonialCard
              key={`${item.key}-${index}`}
              text={item.text}
              name={item.name}
              rating={item.rating}
              avatar={item.avatar}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
