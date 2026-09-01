import LegalPageContent from "@/components/legal/LegalPageContent";
import { API_URL } from "@/utils/api";
import { buildOpenGraph } from "@/utils/og";
import { getServerLang } from "@/utils/server-lang";

const META = {
  az: {
    title: "Geri Qaytarma və Dəyişdirmə Siyasəti",
    description: "Zirelly geri qaytarma və dəyişdirmə qaydaları",
  },
  en: {
    title: "Return & Exchange Policy",
    description: "Zirelly return and exchange rules",
  },
  ru: {
    title: "Политика возврата и обмена",
    description: "Правила возврата и обмена Zirelly",
  },
};

export async function generateMetadata() {
  const lang = await getServerLang();
  const meta = META[lang] || META.az;
  let openGraph = { title: meta.title, description: meta.description, url: "/geri-qaytarma" };

  try {
    const response = await fetch(`${API_URL}/legal/return-policy?lang=${lang}`);

    if (response.ok) {
      const { data } = await response.json();
      openGraph = buildOpenGraph(data, {
        url: "/geri-qaytarma",
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
    alternates: { canonical: "/geri-qaytarma" },
    openGraph,
  };
}

export default function ReturnPolicy() {
  return <LegalPageContent slug="return-policy" />;
}
