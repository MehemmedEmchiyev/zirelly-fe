import NotFoundPage from "@/components/common/NotFoundPage";
import { getServerLang } from "@/utils/server-lang";

const META = {
  az: { title: "Səhifə tapılmadı" },
  en: { title: "Page not found" },
  ru: { title: "Страница не найдена" },
};

export async function generateMetadata() {
  const lang = await getServerLang();
  const meta = META[lang] || META.az;
  return { title: meta.title, robots: { index: false, follow: false } };
}

export default function NotFound() {
  return <NotFoundPage />;
}
