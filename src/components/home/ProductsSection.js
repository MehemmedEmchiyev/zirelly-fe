import Link from "next/link";
import { ProductCard } from "@/components/ui/card";
import { homeProducts } from "@/data/home-products";

export default function ProductsSection() {
  return (
    <section className="w-full px-4 py-10 sm:px-6 sm:py-16 lg:px-[108px] lg:py-20">
      <div className="mx-auto max-w-[1224px]">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold leading-8 text-foreground sm:text-[32px] sm:leading-[40px]">
            Products
          </h2>

          <Link
            href="/products"
            className="shrink-0 text-sm font-normal leading-[18px] text-zinc-500 transition-colors hover:text-foreground"
          >
            See more
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
          {homeProducts.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              title={product.title}
              description={product.description}
              price={product.price}
              originalPrice={product.originalPrice}
              inStock={product.inStock}
              image={product.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
