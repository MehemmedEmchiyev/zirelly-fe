"use client";

import Image from "next/image";
import activateIcon from "@/assets/images/products/Activate.svg";
import cleanseIcon from "@/assets/images/products/Cleanse.svg";
import dispenseIcon from "@/assets/images/products/Dispense.svg";
import pressIcon from "@/assets/images/products/Press.svg";
import proTipIcon from "@/assets/images/products/ProTip.svg";
import sealIcon from "@/assets/images/products/Seal.svg";
import { useLanguage } from "@/context/LanguageContext";

const stepIcons = [cleanseIcon, dispenseIcon, activateIcon, pressIcon, sealIcon];

export default function ProductHowToUse({ steps, proTip }) {
  const { t } = useLanguage();

  if (!steps?.length && !proTip) {
    return null;
  }

  return (
    <section className="w-full">
      {steps?.length > 0 && (
        <>
          <h2 className="mb-6 text-[32px] font-bold leading-[40px] text-foreground">
            {t("product.howToUse")}
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, index) => (
              <article
                key={step.id ?? index}
                className="flex flex-col gap-4 rounded-2xl border border-header-border bg-white p-5"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[32px] font-semibold leading-[40px] text-[#AD8E71]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F7F1E8]">
                    <Image
                      src={stepIcons[index % stepIcons.length]}
                      alt=""
                      width={20}
                      height={20}
                      className="h-5 w-5"
                    />
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-semibold leading-5 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm font-normal leading-5 text-zinc-500">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {proTip && (
        <div className="mt-6 flex items-center gap-3 rounded-3xl bg-[#755C44] px-5 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <Image
              src={proTipIcon}
              alt=""
              width={20}
              height={20}
              className="h-5 w-5"
            />
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-[510] leading-[18px] text-[#B2B2B2]">
              {t("product.proTip")}
            </span>
            <p className="text-sm font-normal leading-5 text-white">{proTip}</p>
          </div>
        </div>
      )}
    </section>
  );
}
