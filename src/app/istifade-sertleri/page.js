import LegalPageContent from "@/components/legal/LegalPageContent";
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
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: "/istifade-sertleri" },
  };
}

export default function TermsOfUse() {
  return <LegalPageContent slug="terms-of-use" />;
}
