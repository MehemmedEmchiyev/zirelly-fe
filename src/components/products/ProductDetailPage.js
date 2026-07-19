"use client";

import { useEffect, useState } from "react";
import NotFoundPage from "@/components/common/NotFoundPage";
import ProductFeatures from "@/components/products/ProductFeatures";
import ProductGallery from "@/components/products/ProductGallery";
import ProductInfo from "@/components/products/ProductInfo";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch, authFetch } from "@/utils/api";
import { isAuthenticated } from "@/utils/auth";

function DetailSkeleton() {
  return (
    <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
      <div className="min-h-[480px] animate-pulse rounded-3xl bg-header-icon-bg" />
      <div className="flex flex-col gap-6">
        <div className="h-5 w-40 animate-pulse rounded-full bg-header-icon-bg" />
        <div className="h-9 w-3/4 animate-pulse rounded-full bg-header-icon-bg" />
        <div className="h-9 w-32 animate-pulse rounded-full bg-header-icon-bg" />
        <div className="h-4 w-full animate-pulse rounded-full bg-header-icon-bg" />
        <div className="h-16 w-full animate-pulse rounded-3xl bg-header-icon-bg" />
        <div className="h-16 w-full animate-pulse rounded-3xl bg-header-icon-bg" />
      </div>
    </div>
  );
}

export default function ProductDetailPage({ slug }) {
  const { language } = useLanguage();
  const [product, setProduct] = useState(null);
  const [phone, setPhone] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setProduct(null);
    setNotFound(false);

    const fetchProduct = isAuthenticated() ? authFetch : apiFetch;

    fetchProduct(`/products/slug/${encodeURIComponent(slug)}`, { lang: language })
      .then((response) => {
        if (cancelled) return;
        setProduct(response.data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.status === 404) setNotFound(true);
      });

    apiFetch("/contact")
      .then((response) => {
        if (cancelled) return;
        setPhone(response.data?.phone || null);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [slug, language]);

  if (notFound) {
    return <NotFoundPage />;
  }

  const images = (product?.images ?? []).map((image) => image.url);
  const features = (product?.features ?? []).map((feature) => ({
    label: feature.name,
    value: feature.value,
  }));

  return (
    <div className="w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-[108px] lg:py-16">
      <div className="mx-auto flex max-w-[1224px] flex-col gap-10 lg:gap-14">
        {product === null ? (
          <DetailSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
              <div className="min-h-[480px] lg:h-auto lg:min-h-full">
                <ProductGallery images={images} />
              </div>
              <div className="lg:min-h-full">
                <ProductInfo product={product} phone={phone} />
              </div>
            </div>

            {features.length > 0 && <ProductFeatures features={features} />}
          </>
        )}
      </div>
    </div>
  );
}
