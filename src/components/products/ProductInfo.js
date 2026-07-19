import Image from "next/image";
import Link from "next/link";
import commentsIcon from "@/assets/images/products/Comments.svg";
import phoneIcon from "@/assets/images/products/Phone.svg";
import reviewIcon from "@/assets/images/products/Review.svg";
import starIcon from "@/assets/images/testimonials/Star.svg";

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 3V13M3 8H13"
        stroke="#171717"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBackground({ children }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-2xl border border-white bg-[#EBEBEB] p-4">
      {children}
    </span>
  );
}

export default function ProductInfo({ product }) {
  return (
    <div className="flex h-full flex-col justify-between gap-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-base font-normal leading-5 text-foreground">
        <div className="flex items-center gap-2">
          <Image
            src={commentsIcon}
            alt=""
            width={18}
            height={18}
            className="h-[18px] w-[18px]"
          />
          <span>{product.reviewsCount} Reviews</span>
        </div>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }, (_, index) => (
            <Image
              key={index}
              src={starIcon}
              alt=""
              width={18}
              height={18}
              className="h-[18px] w-[18px]"
            />
          ))}
          <span>({product.ratingCount})</span>
        </div>

        {product.onlineOrdersOnly && (
          <span className="ml-auto text-base font-normal leading-5 text-foreground">
            Online Orders Only
          </span>
        )}
      </div>

      <h1 className="text-[32px] font-normal leading-[40px] text-foreground">
        {product.title}
      </h1>

      <div className="flex flex-col gap-1">
        <p className="text-xl font-[510] leading-7 text-zinc-400 line-through">
          {product.originalPrice}
        </p>
        <p className="text-[32px] font-bold leading-[40px] text-foreground">
          {product.price}
        </p>
      </div>

      <p className="text-sm font-normal leading-5 text-[#333333]">
        <span className="font-bold text-foreground">Note:</span> {product.note}
      </p>

      <div className="mt-2 flex flex-col gap-3">
        <p className="text-sm font-normal leading-5 text-foreground">Məlumat</p>

        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-3 rounded-3xl bg-[#F3F3F3] p-4 text-left opacity-100 transition-colors hover:bg-[#ececec]"
        >
          <IconBackground>
            <Image
              src={reviewIcon}
              alt=""
              width={22}
              height={22}
              className="h-[22px] w-[22px]"
            />
          </IconBackground>
          <span className="flex-1">
            <span className="block text-sm font-semibold leading-5 text-foreground">
              Reviews
            </span>
            <span className="block text-sm font-normal leading-5 text-zinc-500">
              Click to view
            </span>
          </span>
          <IconBackground>
            <PlusIcon />
          </IconBackground>
        </button>

        <div className="flex w-full items-center gap-3 rounded-3xl bg-[#F3F3F3] p-4 opacity-100">
          <IconBackground>
            <Image
              src={phoneIcon}
              alt=""
              width={22}
              height={22}
              className="h-[22px] w-[22px]"
            />
          </IconBackground>
          <span className="flex-1">
            <span className="block text-sm font-semibold leading-5 text-foreground">
              Any questions?
            </span>
            <span className="block text-sm font-normal leading-5 text-zinc-500">
              Call and ask
            </span>
          </span>
          <Link
            href="tel:+994557300036"
            className="rounded-xl bg-[var(--background-brand,#755C44)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover"
          >
            Zəng et
          </Link>
        </div>
      </div>
    </div>
  );
}
