import AboutPage from "@/components/about/AboutPage";
import { API_URL } from "@/utils/api";

export async function generateMetadata() {
  try {
    const response = await fetch(`${API_URL}/about`);

    if (response.ok) {
      const { data } = await response.json();

      return {
        title: data.meta_title || "About Us",
        description: data.meta_description || "Learn more about Zirelly",
      };
    }
  } catch {
    // API əlçatan olmayanda defolt metadata qalır
  }

  return {
    title: "About Us",
    description: "Learn more about Zirelly",
  };
}

export default function About() {
  return <AboutPage />;
}
