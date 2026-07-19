"use client";

import { useEffect, useState } from "react";
import HeroSlider from "@/components/home/HeroSlider";
import ProductsSlider from "@/components/products/ProductsSlider";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/utils/api";
import fallbackFeaturedImage from "@/assets/images/products/productImage.png";

function formatPrice(value) {
  return `${Number(value).toFixed(2)} ₼`;
}

export default function ProductsPage() {
  const { language, t } = useLanguage();
  const [page, setPage] = useState(null);
  const [products, setProducts] = useState(null);

  useEffect(() => {
    let cancelled = false;

    apiFetch("/products-page", { lang: language })
      .then((response) => {
        if (cancelled) return;
        setPage(response.data);
      })
      .catch(() => {});

    apiFetch("/products?per_page=24", { lang: language })
      .then((response) => {
        if (cancelled) return;
        setProducts(response.data);
      })
      .catch(() => {
        if (cancelled) return;
        setProducts([]);
      });

    return () => {
      cancelled = true;
    };
  }, [language]);

  const heroSlides = (page?.slides ?? []).map((slide) => ({
    id: slide.id,
    title: "",
    button_text: "",
    link: "",
    image: slide,
    hide_button: true,
  }));

  const items = (products ?? []).map((product) => ({
    id: product.id,
    slug: product.slug,
    title: product.title,
    description: product.description,
    price: formatPrice(product.final_price ?? product.price),
    originalPrice: product.discount != null ? formatPrice(product.price) : null,
    inStock: product.is_active,
    image: product.images?.[0]?.url ?? null,
  }));

  return (
    <>
      {heroSlides.length > 0 && (
        <section className="w-full px-4 pt-6 sm:px-6 lg:px-[108px]">
          <div className="mx-auto max-w-[1224px]">
            <HeroSlider slides={heroSlides} />
          </div>
        </section>
      )}

      <section className="w-full px-4 py-10 sm:px-6 sm:py-16 lg:px-[108px] lg:py-20">
        <div className="mx-auto max-w-[1224px]">
          <h2 className="mb-8 text-[32px] font-bold leading-[40px] text-foreground sm:mb-10">
            {page?.products_title || t("nav.products")}
          </h2>

          {products === null && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className="h-96 w-full animate-pulse rounded-[40px] bg-header-icon-bg"
                />
              ))}
            </div>
          )}

          {products !== null && items.length === 0 && (
            <p className="py-10 text-center text-zinc-500">
              {t("products.empty")}
            </p>
          )}

          {products !== null && items.length > 0 && (
            <ProductsSlider
              products={items}
              featuredImage={page?.side_image?.url ?? fallbackFeaturedImage}
            />
          )}
        </div>
      </section>
    </>
  );
}
