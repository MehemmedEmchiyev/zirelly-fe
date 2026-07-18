import { achievements } from "@/data/achievements";

export default function AchievementsSection() {
  return (
    <section className="w-full px-4 py-10 sm:px-6 sm:py-16 lg:px-[108px] lg:py-20">
      <div className="mx-auto max-w-[1224px]">
        <h2 className="text-center text-2xl font-bold leading-8 text-foreground sm:text-[32px] sm:leading-[40px]">
          Our Achievements in Numbers
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 lg:mt-12 lg:grid-cols-4 lg:gap-5">
          {achievements.map((item) => (
            <article
              key={item.id}
              className={`flex min-h-[148px] flex-col justify-between rounded-3xl p-4 sm:min-h-[200px] sm:p-6 lg:min-h-[220px] lg:p-8 ${item.textColor}`}
              style={{ background: item.background }}
            >
              <p className="text-xs font-normal leading-[18px]">{item.title}</p>

              <div>
                <p className="text-[32px] font-[510] leading-[40px] sm:text-[40px] sm:leading-[48px]">
                  <span className="sm:hidden">{item.mobileValue ?? item.value}</span>
                  <span className="hidden sm:inline">{item.value}</span>
                </p>

                <p className="text-lg font-normal leading-7 sm:text-2xl sm:leading-8">
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
