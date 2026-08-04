import LegalPageContent from "@/components/legal/LegalPageContent";
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
  return { title: meta.title, description: meta.description };
}

export default function PrivacyPolicy() {
  return <LegalPageContent slug="privacy-policy" />;
}
