import Image from "next/image";
import activateIcon from "@/assets/images/products/Activate.svg";
import cleanseIcon from "@/assets/images/products/Cleanse.svg";
import dispenseIcon from "@/assets/images/products/Dispense.svg";
import pressIcon from "@/assets/images/products/Press.svg";
import proTipIcon from "@/assets/images/products/ProTip.svg";
import sealIcon from "@/assets/images/products/Seal.svg";

const stepIcons = {
  cleanse: cleanseIcon,
  dispense: dispenseIcon,
  activate: activateIcon,
  press: pressIcon,
  seal: sealIcon,
};

export default function ProductHowToUse({ steps, proTip }) {
  return (
    <section className="w-full">
      <h2 className="mb-6 text-[32px] font-bold leading-[40px] text-foreground">
        How to use
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((item) => (
          <article
            key={item.step}
            className="flex flex-col gap-3 rounded-2xl border border-[var(--content-secondary-inverse)] bg-white p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-2xl font-bold leading-8 text-[var(--background-brand,#755C44)]">
                {item.step}
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8DFD6]">
                <Image
                  src={stepIcons[item.icon] ?? cleanseIcon}
                  alt=""
                  width={18}
                  height={18}
                  className="h-[18px] w-[18px]"
                />
              </span>
            </div>
            <h3 className="text-base font-semibold leading-5 text-foreground">
              {item.title}
            </h3>
            <p className="text-sm font-normal leading-5 text-zinc-500">
              {item.description}
            </p>
          </article>
        ))}
      </div>

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
            Pro Tip
          </span>
          <p className="text-sm font-normal leading-5 text-white">{proTip}</p>
        </div>
      </div>
    </section>
  );
}
