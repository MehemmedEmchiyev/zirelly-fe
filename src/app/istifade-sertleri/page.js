import LegalPageContent from "@/components/legal/LegalPageContent";
import { API_URL } from "@/utils/api";
import { buildOpenGraph } from "@/utils/og";
import { getServerLang } from "@/utils/server-lang";

const META = {
  az: {
    title: "Saytdan İstifadə Şərtləri",
    description: "Zirelly saytından istifadə qaydaları",
  },
  en: {
    title: "Terms of Use",
    description: "Zirelly website terms of use",
  },
  ru: {
    title: "Условия использования",
    description: "Правила использования сайта Zirelly",
  },
};

export async function generateMetadata() {
  const lang = await getServerLang();
  const meta = META[lang] || META.az;
  let openGraph = { title: meta.title, description: meta.description, url: "/istifade-sertleri" };

  try {
    const response = await fetch(`${API_URL}/legal/terms-of-use?lang=${lang}`);

    if (response.ok) {
      const { data } = await response.json();
      openGraph = buildOpenGraph(data, {
        url: "/istifade-sertleri",
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
    alternates: { canonical: "/istifade-sertleri" },
    openGraph,
  };
}

export default function TermsOfUse() {
  return <LegalPageContent slug="terms-of-use" />;
}
