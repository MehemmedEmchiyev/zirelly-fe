import LegalPageContent from "@/components/legal/LegalPageContent";
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
  return { title: meta.title, description: meta.description };
}

export default function ReturnPolicy() {
  return <LegalPageContent slug="return-policy" />;
}
