import { SITE_URL } from "@/constants/site";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/profil", "/sebet", "/odenis-neticesi"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
