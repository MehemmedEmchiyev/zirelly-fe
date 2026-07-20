"use client";

import CartContent from "@/components/cart/CartContent";

export default function CartPage() {
  return (
    <section className="mx-auto w-full px-4 pb-20 pt-6 sm:px-6 lg:px-[108px]">
      <div className="mx-auto w-full max-w-[1224px]">
        <CartContent variant="page" />
      </div>
    </section>
  );
}
