"use client";

import Link from "next/link";
import {
  ProfileCartIcon,
  ProfileEyeIcon,
  ProfileLogoutIcon,
  ProfileUserIcon,
} from "@/components/profile/ProfileIcons";

const TABS = [
  { id: "profile", label: "Profile", icon: ProfileUserIcon, type: "tab" },
  {
    id: "recently-viewed",
    label: "Recently Viewed",
    icon: ProfileEyeIcon,
    type: "tab",
  },
  { id: "cart", label: "Cart", icon: ProfileCartIcon, type: "link", href: "/cart" },
  { id: "logout", label: "Log out", icon: ProfileLogoutIcon, type: "action" },
];

function TabContent({ Icon, label }) {
  return (
    <>
      <Icon className="h-5 w-5 shrink-0" />
      <span className="whitespace-nowrap text-sm font-normal leading-5">{label}</span>
    </>
  );
}

export default function ProfileSidebar({ activeTab, onTabChange, onLogout }) {
  const itemBase =
    "flex w-full items-center gap-3 rounded-[20px] p-2 text-left transition-colors";

  return (
    <nav
      aria-label="Profile navigation"
      className="flex w-full gap-2 overflow-x-auto rounded-xl border border-header-border bg-header-icon-bg p-2 lg:w-[220px] lg:shrink-0 lg:flex-col lg:overflow-visible"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const classes = `${itemBase} ${
          isActive
            ? "bg-[#AD8E71] text-white"
            : "bg-transparent text-[#666666] hover:bg-white/60"
        } ${tab.id === "logout" ? "hidden lg:flex" : ""}`;

        if (tab.type === "link") {
          return (
            <Link key={tab.id} href={tab.href} className={classes}>
              <TabContent Icon={tab.icon} label={tab.label} />
            </Link>
          );
        }

        if (tab.type === "action") {
          return (
            <button key={tab.id} type="button" onClick={onLogout} className={classes}>
              <TabContent Icon={tab.icon} label={tab.label} />
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={classes}
            aria-current={isActive ? "page" : undefined}
          >
            <TabContent Icon={tab.icon} label={tab.label} />
          </button>
        );
      })}
    </nav>
  );
}
