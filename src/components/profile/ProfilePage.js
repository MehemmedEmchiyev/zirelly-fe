"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CartContent from "@/components/cart/CartContent";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import RecentlyViewed from "@/components/profile/RecentlyViewed";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <section className="mx-auto w-full px-4 pb-20 pt-6 sm:px-6 lg:px-[108px]">
      <div className="mx-auto flex w-full max-w-[1224px] flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
        <ProfileSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />

        {activeTab === "profile" && <ProfileForm />}

        {activeTab === "recently-viewed" && <RecentlyViewed />}

        {activeTab === "cart" && <CartContent variant="profile" />}
      </div>
    </section>
  );
}
