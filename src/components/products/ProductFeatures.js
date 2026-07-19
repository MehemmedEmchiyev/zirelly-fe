import Image from "next/image";
import featuresIcon from "@/assets/images/products/Features.svg";

export default function ProductFeatures({ features }) {
  return (
    <section className="w-full rounded-3xl bg-[#F3F3F3] p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex shrink-0 items-center justify-center rounded-2xl border border-white bg-[#EBEBEB] p-4">
          <Image
            src={featuresIcon}
            alt=""
            width={20}
            height={20}
            className="h-5 w-5"
          />
        </span>
        <h2 className="text-lg font-semibold leading-6 text-foreground">
          Features
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-x-10 gap-y-0 sm:grid-cols-2">
        {features.map((feature, index) => (
          <div
            key={`${feature.label}-${index}`}
            className="flex items-center justify-between gap-4 border-b border-[#E0E0E0] py-3 text-sm font-normal leading-5 text-[#333333]"
          >
            <span>{feature.label}</span>
            <span className="text-right">{feature.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
