import AboutPage from "@/components/about/AboutPage";
import { API_URL } from "@/utils/api";
import { buildOpenGraph } from "@/utils/og";
import { getServerLang } from "@/utils/server-lang";

export async function generateMetadata() {
  const lang = await getServerLang();

  try {
    const response = await fetch(`${API_URL}/about?lang=${lang}`);

    if (response.ok) {
      const { data } = await response.json();

      return {
        title: data.meta_title ? { absolute: data.meta_title } : "About Us",
        alternates: { canonical: "/haqqimizda" },
        description: data.meta_description || "Learn more about Zirelly",
        openGraph: buildOpenGraph(data, {
          url: "/haqqimizda",
          title: "About Us",
          description: "Learn more about Zirelly",
        }),
      };
    }
  } catch {
    // API əlçatan olmayanda defolt metadata qalır
  }

  return {
    title: "About Us",
    alternates: { canonical: "/haqqimizda" },
    description: "Learn more about Zirelly",
  };
}

export default function About() {
  return <AboutPage />;
}
