import LegalPageContent from "@/components/legal/LegalPageContent";
import { API_URL } from "@/utils/api";
import { buildOpenGraph } from "@/utils/og";
import { getServerLang } from "@/utils/server-lang";

const META = {
  az: {
    title: "Məxfilik Siyasəti",
    description: "Zirelly məxfilik siyasəti",
  },
  en: {
    title: "Privacy Policy",
    description: "Zirelly privacy policy",
  },
  ru: {
    title: "Политика конфиденциальности",
    description: "Политика конфиденциальности Zirelly",
  },
};

export async function generateMetadata() {
  const lang = await getServerLang();
  const meta = META[lang] || META.az;
  let openGraph = { title: meta.title, description: meta.description, url: "/mexfilik-siyaseti" };

  try {
    const response = await fetch(`${API_URL}/legal/privacy-policy?lang=${lang}`);

    if (response.ok) {
      const { data } = await response.json();
      openGraph = buildOpenGraph(data, {
        url: "/mexfilik-siyaseti",
        title: meta.title,
        description: meta.description,
      });
    }
  } catch {
    // API əlçatan olmayanda defolt OG qalır
  }

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: "/mexfilik-siyaseti" },
    openGraph,
  };
}

export default function PrivacyPolicy() {
  return <LegalPageContent slug="privacy-policy" />;
}
