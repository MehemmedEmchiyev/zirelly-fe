"use client";

import { sendGTMEvent } from "@next/third-parties/google";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

// Hər səhifə baxışında (ilk açılış, refresh və sayt daxili keçid) dataLayer-ə
// tam olaraq bir "virtual_page_view" göndərilir. GTM-də səhifə baxışı tag-ləri
// "Page View" / "History Change" yox, yalnız bu Custom Event-ə bağlanmalıdır.
export default function GtmPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams?.toString() ?? "";

  useEffect(() => {
    // document.title yeni səhifənin metadata-sı ilə bir az gec yenilənir
    const timer = setTimeout(() => {
      sendGTMEvent({
        event: "virtual_page_view",
        page_path: window.location.pathname + window.location.search,
        page_location: window.location.href,
        page_title: document.title,
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, query]);

  return null;
}
