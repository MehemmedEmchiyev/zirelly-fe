import HomePage from "@/components/home/HomePage";
import { API_URL } from "@/utils/api";
import { getServerLang } from "@/utils/server-lang";

export async function generateMetadata() {
  const lang = await getServerLang();

  try {
    const response = await fetch(`${API_URL}/home?lang=${lang}`);

    if (response.ok) {
      const { data } = await response.json();

      return {
        title: data.meta_title || "Home",
        description: data.meta_description || "Welcome to Zirelly",
      };
    }
  } catch {
    // API əlçatan olmayanda defolt metadata qalır
  }

  return {
    title: "Home",
    description: "Welcome to Zirelly",
  };
}

export default function Home() {
  return <HomePage />;
}
