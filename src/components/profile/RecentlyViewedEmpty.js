import Image from "next/image";
import Link from "next/link";
import emptyStateImage from "@/assets/images/products/emptyState.png";

export default function RecentlyViewedEmpty() {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      <div className="rounded-xl bg-header-icon-bg px-4 py-3">
        <h1 className="text-base font-bold leading-5 text-foreground">
          Recently Viewed
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center gap-6 rounded-xl bg-header-icon-bg px-4 py-12 sm:py-16">
        <Image
          src={emptyStateImage}
          alt=""
          width={200}
          height={160}
          className="h-auto w-[160px] object-contain sm:w-[200px]"
        />

        <div className="flex max-w-[360px] flex-col items-center gap-2 text-center">
          <h2 className="text-xl font-bold leading-7 text-foreground">
            Looks like you&apos;re just getting started
          </h2>
          <p className="text-sm font-normal leading-5 text-[#666666]">
            Browse our catalog. We&apos;ll save the products you view so you can
            easily return to them anytime.
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex w-max cursor-pointer items-center justify-center gap-2 rounded-[24px] border border-[var(--background-brand,#755C44)] bg-[var(--background-brand,#755C44)] px-4 py-3 text-sm font-normal leading-5 text-white transition-colors hover:bg-brand-primary-hover"
        >
          Discover Products
        </Link>
      </div>
    </div>
  );
}
