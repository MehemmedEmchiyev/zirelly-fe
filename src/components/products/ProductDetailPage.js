import ProductFeatures from "@/components/products/ProductFeatures";
import ProductGallery from "@/components/products/ProductGallery";
import ProductHowToUse from "@/components/products/ProductHowToUse";
import ProductInfo from "@/components/products/ProductInfo";
import { getProductBySlug } from "@/data/product-detail";

export default function ProductDetailPage({ slug }) {
  const product = getProductBySlug(slug);

  return (
    <div className="w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-[108px] lg:py-16">
      <div className="mx-auto flex max-w-[1224px] flex-col gap-10 lg:gap-14">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="min-h-[480px] lg:h-auto lg:min-h-full">
            <ProductGallery images={product.images} />
          </div>
          <div className="lg:min-h-full">
            <ProductInfo product={product} />
          </div>
        </div>

        <ProductFeatures features={product.features} />
        <ProductHowToUse steps={product.howToUse} proTip={product.proTip} />
      </div>
    </div>
  );
}
