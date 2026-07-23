import ProductsPage from "@/components/products/ProductsPage";
import { API_URL } from "@/utils/api";
import { getServerLang } from "@/utils/server-lang";

const FALLBACK = {
  az: { title: "Məhsullar", description: "Məhsullarımıza baxın" },
  en: { title: "Products", description: "Browse our products" },
  ru: { title: "Продукты", description: "Смотрите наши продукты" },
};

export async function generateMetadata() {
  const lang = await getServerLang();
  const fallback = FALLBACK[lang] || FALLBACK.az;

  try {
    const response = await fetch(`${API_URL}/products-page?lang=${lang}`);

    if (response.ok) {
      const { data } = await response.json();

      return {
        title: data.meta_title || fallback.title,
        description: data.meta_description || fallback.description,
      };
    }
  } catch {
    // API əlçatan olmayanda dilə uyğun defolt qalır
  }

  return { title: fallback.title, description: fallback.description };
}

export default function Products() {
  return <ProductsPage />;
}
