"use client";

import { useEffect, useState } from "react";
import RecentlyViewedEmpty from "@/components/profile/RecentlyViewedEmpty";
import { ProductCard } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { authFetch } from "@/utils/api";

function formatPrice(value) {
  return `${Number(value).toFixed(2)} ₼`;
}

export default function RecentlyViewed() {
  const { language, t } = useLanguage();
  const [views, setViews] = useState(null);

  useEffect(() => {
    let cancelled = false;

    authFetch(`/recent-views?lang=${language}`)
      .then((response) => {
        if (cancelled) return;
        setViews(response.data);
      })
      .catch(() => {
        if (cancelled) return;
        setViews([]);
      });

    return () => {
      cancelled = true;
    };
  }, [language]);

  const products = (views ?? [])
    .map((view) => view.product)
    .filter(Boolean);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      <div className="rounded-xl bg-header-icon-bg px-4 py-3">
        <h1 className="text-base font-bold leading-5 text-foreground">
          {t("profile.recentlyViewed")}
        </h1>
      </div>

      {views === null && (
        <div className="grid grid-cols-1 gap-5 rounded-xl bg-header-icon-bg p-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-72 w-full animate-pulse rounded-[40px] bg-white" />
          ))}
        </div>
      )}

      {views !== null && products.length === 0 && <RecentlyViewedEmpty />}

      {views !== null && products.length > 0 && (
        <div className="grid grid-cols-1 gap-5 rounded-xl bg-header-icon-bg p-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              title={product.title}
              description={product.description}
              price={formatPrice(product.final_price ?? product.price)}
              originalPrice={
                product.discount != null ? formatPrice(product.price) : null
              }
              inStock={product.is_active}
              image={product.images?.[0]?.url ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
