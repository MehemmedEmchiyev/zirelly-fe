"use client";

import { useLanguage } from "@/context/LanguageContext";

const cardStyles = [
  { background: "var(--content-brand, #755C44)", textColor: "text-white" },
  { background: "var(--content-primary, #1A1A1A)", textColor: "text-white" },
  {
    background: "var(--content-secondary-inverse, #F3F3F3)",
    textColor: "text-foreground",
  },
  { background: "#FFFAEB", textColor: "text-foreground" },
];

export default function AchievementsSection({ title, items }) {
  const { t } = useLanguage();

  if (!items?.length) {
    return null;
  }

  return (
    <section className="w-full px-4 py-10 sm:px-6 sm:py-16 lg:px-[108px] lg:py-20">
      <div className="mx-auto max-w-[1224px]">
        <h2 className="text-center text-2xl font-bold leading-8 text-foreground sm:text-[32px] sm:leading-[40px]">
          {title || t("home.achievementsTitle")}
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 lg:mt-12 lg:grid-cols-4 lg:gap-5">
          {items.map((item, index) => {
            const style = cardStyles[index % cardStyles.length];

            return (
              <article
                key={item.id}
                className={`flex min-h-[148px] flex-col justify-end rounded-3xl p-4 sm:min-h-[200px] sm:p-6 lg:min-h-[220px] lg:p-8 ${style.textColor}`}
                style={{ background: style.background }}
              >
                <p className="text-[32px] font-[510] leading-[40px] sm:text-[40px] sm:leading-[48px]">
                  {item.value}
                </p>

                <p className="text-lg font-normal leading-7 sm:text-2xl sm:leading-8">
                  {item.label}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
