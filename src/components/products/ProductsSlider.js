"use client";

import Image from "next/image";
import { useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductCard } from "@/components/ui/card";

import "swiper/css";
import "swiper/css/navigation";

function ArrowIcon({ direction }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={
          direction === "prev"
            ? "M12.5 5L7.5 10L12.5 15"
            : "M7.5 5L12.5 10L7.5 15"
        }
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SliderArrows({ swiper, isBeginning, isEnd }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        aria-label="Previous products"
        disabled={isBeginning}
        onClick={() => swiper?.slidePrev()}
        className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
          isBeginning
            ? "cursor-not-allowed bg-[#F3F3F3] text-zinc-400"
            : "cursor-pointer bg-[var(--background-brand,#755C44)] text-white"
        }`}
      >
        <ArrowIcon direction="prev" />
      </button>

      <button
        type="button"
        aria-label="Next products"
        disabled={isEnd}
        onClick={() => swiper?.slideNext()}
        className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
          isEnd
            ? "cursor-not-allowed bg-[#F3F3F3] text-zinc-400"
            : "cursor-pointer bg-[var(--background-brand,#755C44)] text-white"
        }`}
      >
        <ArrowIcon direction="next" />
      </button>
    </div>
  );
}

function useSliderNav() {
  const [swiper, setSwiper] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  function updateNavState(instance) {
    setIsBeginning(instance.isBeginning);
    setIsEnd(instance.isEnd);
  }

  return {
    swiper,
    isBeginning,
    isEnd,
    swiperProps: {
      onSwiper: (instance) => {
        setSwiper(instance);
        updateNavState(instance);
      },
      onSlideChange: updateNavState,
      onReachBeginning: updateNavState,
      onReachEnd: updateNavState,
      onFromEdge: updateNavState,
    },
  };
}

export default function ProductsSlider({ products, featuredImage }) {
  const mobileNav = useSliderNav();
  const desktopNav = useSliderNav();

  return (
    <>
      {/* Mobile: featured image + cards in one horizontal slider */}
      <div className="flex flex-col gap-6 lg:hidden">
        <Swiper
          modules={[Navigation]}
          {...mobileNav.swiperProps}
          spaceBetween={12}
          slidesPerView={1.15}
          className="products-page-swiper products-page-swiper-mobile w-full"
        >
          <SwiperSlide className="!h-auto">
            <div className="relative h-full w-full overflow-hidden rounded-2xl">
              <Image
                src={featuredImage}
                alt="Featured product"
                fill
                priority
                quality={90}
                sizes="(max-width: 1024px) 90vw, 600px"
                className="object-cover object-center"
              />
            </div>
          </SwiperSlide>

          {products.map((product) => (
            <SwiperSlide key={product.id} className="!h-auto">
              <ProductCard
                className="h-full"
                productId={product.id}
                slug={product.slug}
                title={product.title}
                description={product.description}
                price={product.price}
                originalPrice={product.originalPrice}
                inStock={product.inStock}
                image={product.image}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <SliderArrows
          swiper={mobileNav.swiper}
          isBeginning={mobileNav.isBeginning}
          isEnd={mobileNav.isEnd}
        />
      </div>

      {/* Desktop: featured image left + cards slider right */}
      <div className="hidden flex-col gap-6 lg:flex">
        <div className="grid grid-cols-[1.15fr_1fr] items-stretch gap-8">
          <div className="relative min-h-full w-full overflow-hidden rounded-2xl">
            <Image
              src={featuredImage}
              alt="Featured product"
              fill
              priority
              quality={90}
              sizes="(max-width: 1024px) 90vw, 600px"
              className="object-cover object-center"
            />
          </div>

          <div className="min-w-0">
            <Swiper
              modules={[Navigation]}
              {...desktopNav.swiperProps}
              spaceBetween={20}
              slidesPerView={2}
              className="products-page-swiper h-full w-full"
            >
              {products.map((product) => (
                <SwiperSlide key={product.id} className="!h-auto">
                  <ProductCard
                    productId={product.id}
                    slug={product.slug}
                    title={product.title}
                    description={product.description}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    inStock={product.inStock}
                    image={product.image}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <SliderArrows
          swiper={desktopNav.swiper}
          isBeginning={desktopNav.isBeginning}
          isEnd={desktopNav.isEnd}
        />
      </div>
    </>
  );
}
