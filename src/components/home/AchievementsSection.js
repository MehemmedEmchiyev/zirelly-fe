import { achievements } from "@/data/achievements";

export default function AchievementsSection() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-[108px] lg:py-20">
      <div className="mx-auto max-w-[1224px]">
        <h2 className="text-center text-[32px] font-bold leading-[40px] text-foreground">
          Our Achievements in Numbers
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-5">
          {achievements.map((item) => (
            <article
              key={item.id}
              className={`flex min-h-[200px] flex-col justify-between rounded-3xl p-6 lg:min-h-[220px] lg:p-8 ${item.textColor}`}
              style={{ background: item.background }}
            >
              <p className="text-xs font-normal leading-[18px]">{item.title}</p>

              <div>
                <p className="text-[40px] font-[510] leading-[48px]">
                  {item.value}
                </p>

                <p className="text-2xl font-normal leading-8">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
