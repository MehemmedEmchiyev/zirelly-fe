"use client";

import Image from "next/image";
import { useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

function ArrowIcon({ direction }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={
          direction === "prev"
            ? "M10 4L6 8L10 12"
            : "M6 4L10 8L6 12"
        }
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProductGallery({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="relative min-h-[360px] flex-1 overflow-hidden rounded-3xl bg-[#F5F0EB] sm:min-h-[420px] lg:min-h-0">
        <Image
          src={activeImage}
          alt="Product"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Previous image"
          onClick={() => thumbsSwiper?.slidePrev()}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#F3F3F3] text-zinc-600 transition-colors hover:bg-[#e8e8e8]"
        >
          <ArrowIcon direction="prev" />
        </button>

        <Swiper
          modules={[Navigation]}
          onSwiper={setThumbsSwiper}
          spaceBetween={8}
          slidesPerView={4.2}
          breakpoints={{
            640: { slidesPerView: 5, spaceBetween: 10 },
          }}
          className="product-thumbs-swiper min-w-0 flex-1"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`aspect-square w-full cursor-pointer rounded-xl border p-1.5 transition-colors ${
                  activeIndex === index
                    ? "border-[var(--background-brand,#755C44)]"
                    : "border-[#CCCCCC]"
                }`}
              >
                <span className="relative block h-full w-full overflow-hidden rounded-xl">
                  <Image
                    src={image}
                    alt=""
                    fill
                    className="object-cover object-center"
                  />
                </span>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          aria-label="Next image"
          onClick={() => thumbsSwiper?.slideNext()}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#F3F3F3] text-zinc-600 transition-colors hover:bg-[#e8e8e8]"
        >
          <ArrowIcon direction="next" />
        </button>
      </div>
    </div>
  );
}
