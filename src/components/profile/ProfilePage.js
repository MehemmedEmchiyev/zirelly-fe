"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import RecentlyViewedEmpty from "@/components/profile/RecentlyViewedEmpty";
import { STORAGE_KEYS } from "@/constants/storage-keys";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    router.push("/");
    router.refresh();
  }

  return (
    <section className="mx-auto w-full px-4 pb-20 pt-16 sm:px-6 lg:px-[108px] lg:pt-[100px]">
      <div className="mx-auto flex w-full max-w-[1224px] flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
        <ProfileSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />

        {activeTab === "profile" && <ProfileForm />}

        {activeTab === "recently-viewed" && <RecentlyViewedEmpty />}
      </div>
    </section>
  );
}
