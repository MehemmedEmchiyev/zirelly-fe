import AchievementsSection from "@/components/home/AchievementsSection";
import HeroSlider from "@/components/home/HeroSlider";

export default function HomePage() {
  return (
    <>
      <section className="w-full px-4 pt-6 sm:px-6 lg:px-[108px]">
        <div className="mx-auto max-w-[1224px]">
          <HeroSlider />
        </div>
      </section>

      <AchievementsSection />
    </>
  );
}
