"use client";

import dynamic from "next/dynamic";

const SitePopup = dynamic(() => import("@/components/layout/SitePopup"), {
  ssr: false,
});

export default function DeferredPopup() {
  return <SitePopup />;
}
