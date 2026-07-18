import HeroSlider from "@/components/home/HeroSlider";
import ProductsSlider from "@/components/products/ProductsSlider";

export default function ProductsPage() {
  return (
    <>
      <section className="w-full px-4 pt-6 sm:px-6 lg:px-[108px]">
        <div className="mx-auto max-w-[1224px]">
          <HeroSlider />
        </div>
      </section>

      <section className="w-full px-4 py-10 sm:px-6 sm:py-16 lg:px-[108px] lg:py-20">
        <div className="mx-auto max-w-[1224px]">
          <h2 className="mb-8 text-[32px] font-bold leading-[40px] text-foreground sm:mb-10">
            Products
          </h2>

          <ProductsSlider />
        </div>
      </section>
    </>
  );
}
