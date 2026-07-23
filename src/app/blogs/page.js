import BlogsPage from "@/components/blogs/BlogsPage";
import { getServerLang } from "@/utils/server-lang";

const META = {
  az: { title: "Bloqlar", description: "Ən son yazılarımızı oxuyun" },
  en: { title: "Blogs", description: "Read our latest articles" },
  ru: { title: "Блоги", description: "Читайте наши последние статьи" },
};

export async function generateMetadata() {
  const lang = await getServerLang();
  const meta = META[lang] || META.az;

  return { title: meta.title, description: meta.description };
}

export default function Blogs() {
  return <BlogsPage />;
}
