import AchievementsSection from "@/components/home/AchievementsSection";
import BannerSection from "@/components/home/BannerSection";
import FaqSection from "@/components/home/FaqSection";
import HeroSlider from "@/components/home/HeroSlider";
import ProductsSection from "@/components/home/ProductsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export default function HomePage() {
  return (
    <>
      <section className="w-full px-4 pt-6 sm:px-6 lg:px-[108px]">
        <div className="mx-auto max-w-[1224px]">
          <HeroSlider />
        </div>
      </section>

      <AchievementsSection />
      <ProductsSection />
      <BannerSection />
      <TestimonialsSection />
      <FaqSection />
    </>
  );
}
