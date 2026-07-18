"use client";

import { useEffect, useState } from "react";
import AchievementsSection from "@/components/home/AchievementsSection";
import BannerSection from "@/components/home/BannerSection";
import FaqSection from "@/components/home/FaqSection";
import HeroSlider from "@/components/home/HeroSlider";
import ProductsSection from "@/components/home/ProductsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/utils/api";

export default function HomePage() {
  const { language } = useLanguage();
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);

    apiFetch("/home", { lang: language })
      .then((response) => {
        if (cancelled) return;
        setHome(response.data);
      })
      .catch(() => {})
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    apiFetch("/products?per_page=4", { lang: language })
      .then((response) => {
        if (cancelled) return;
        setProducts(response.data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [language]);

  return (
    <>
      <section className="w-full px-4 pt-6 sm:px-6 lg:px-[108px]">
        <div className="mx-auto max-w-[1224px]">
          {loading ? (
            <div className="min-h-[88vh] w-full animate-pulse rounded-3xl bg-header-icon-bg" />
          ) : (
            <HeroSlider slides={home?.slides} />
          )}
        </div>
      </section>

      <AchievementsSection
        title={home?.stats?.title}
        items={home?.stats?.items}
      />
      <ProductsSection products={products} />
      <BannerSection banner={home?.banner} />
      <TestimonialsSection
        title={home?.testimonials?.title}
        items={home?.testimonials?.items}
      />
      <FaqSection title={home?.faq?.title} items={home?.faq?.items} />
    </>
  );
}
