"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

function formatPrice(value) {
  return `${Number(value).toFixed(2)} ₼`;
}

export default function ProductsSection({ products }) {
  const { t } = useLanguage();

  if (!products?.length) {
    return null;
  }

  return (
    <section className="w-full px-4 py-10 sm:px-6 sm:py-16 lg:px-[108px] lg:py-20">
      <div className="mx-auto max-w-[1224px]">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold leading-8 text-foreground sm:text-[32px] sm:leading-[40px]">
            {t("nav.products")}
          </h2>

          <Link
            href="/products"
            className="shrink-0 text-sm font-normal leading-[18px] text-zinc-500 transition-colors hover:text-foreground"
          >
            {t("home.seeMore")}
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
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
      </div>
    </section>
  );
}
