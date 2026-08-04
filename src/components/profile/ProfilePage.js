"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import CartContent from "@/components/cart/CartContent";
import OrdersList from "@/components/profile/OrdersList";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import RecentlyViewed from "@/components/profile/RecentlyViewed";
import { useAuth } from "@/context/AuthContext";

const VALID_TABS = ["profile", "orders", "recently-viewed", "cart"];

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout } = useAuth();

  const requestedTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    VALID_TABS.includes(requestedTab) ? requestedTab : "profile",
  );

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <section className="mx-auto w-full px-4 pb-20 pt-6 sm:px-6 lg:px-[108px] lg:pt-16">
      <div className="mx-auto flex w-full max-w-[1224px] flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
        <ProfileSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />

        {activeTab === "profile" && <ProfileForm />}

        {activeTab === "orders" && <OrdersList />}

        {activeTab === "recently-viewed" && <RecentlyViewed />}

        {activeTab === "cart" && <CartContent variant="profile" />}
      </div>
    </section>
  );
}
