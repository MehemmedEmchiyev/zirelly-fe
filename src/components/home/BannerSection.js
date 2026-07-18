import Image from "next/image";
import { Button } from "@/components/ui/button";
import bannerImage from "@/assets/images/home/banner.png";

export default function BannerSection() {
  return (
    <section className="w-full px-4 py-10 sm:px-6 sm:py-16 lg:px-[108px] lg:py-20">
      {/* Mobile layout — full-bleed image with overlays */}
      <div className="relative mx-auto flex min-h-[520px] max-w-[1224px] flex-col justify-between overflow-hidden rounded-[40px] p-6 lg:hidden">
        <Image
          src={bannerImage}
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/20" />

        <p className="relative z-10 text-2xl font-[590] leading-8 text-white">
          We design spaces not just to look beautiful, but to make living within
          them a true pleasure.
        </p>

        <Button href="/products" className="relative z-10 w-full">
          See all products
        </Button>
      </div>

      {/* Desktop layout */}
      <div className="relative mx-auto hidden min-h-[560px] max-w-[1224px] flex-col justify-between overflow-hidden rounded-[40px] bg-[#8F7A66] p-10 lg:flex">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={bannerImage}
            alt=""
            fill
            className="object-cover object-center"
          />
        </div>

        <p className="relative z-10 ml-auto max-w-[400px] text-left text-2xl font-[590] leading-8 text-white">
          We design <span className="font-bold">spaces</span> not just to{" "}
          <span className="font-bold">look beautiful</span>, but to make living
          within them <span className="font-bold">a true pleasure</span>.
        </p>

        <div className="relative z-10 mt-auto flex items-end justify-between gap-8 pt-16">
          <p className="max-w-[400px] text-2xl font-[590] leading-8 text-white">
            <span className="font-bold">Each detail</span> is thoughtfully
            selected to let you experience{" "}
            <span className="font-bold">harmony and natural balance</span> in
            every step.
          </p>

          <Button href="/products" className="shrink-0">
            See all products
          </Button>
        </div>
      </div>
    </section>
  );
}
