"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Sayt daxili keçidlərdə səhifə yenidən yüklənmir, ona görə GTM-in "All Pages"
// triggeri yalnız ilk açılışda işləyir. Hər sonrakı keçid üçün dataLayer-ə
// "route_change" hadisəsi göndərilir. İlk yükləmə ötürülür ki, mövcud
// "All Pages" triggeri ilə ikiqat sayılmasın.
export default function GtmPageView() {
  const pathname = usePathname();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    // document.title yeni səhifənin metadata-sı ilə bir az gec yenilənir
    const timer = setTimeout(() => {
      sendGTMEvent({
        event: "route_change",
        page_path: window.location.pathname + window.location.search,
        page_location: window.location.href,
        page_title: document.title,
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
