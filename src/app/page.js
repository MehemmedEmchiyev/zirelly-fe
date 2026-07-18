import HomePage from "@/components/home/HomePage";
import { API_URL } from "@/utils/api";

export async function generateMetadata() {
  try {
    const response = await fetch(`${API_URL}/home`);

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
