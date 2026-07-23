import ProductDetailPage from "@/components/products/ProductDetailPage";
import { API_URL } from "@/utils/api";
import { getServerLang } from "@/utils/server-lang";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const lang = await getServerLang();

  try {
    const response = await fetch(
      `${API_URL}/products/slug/${encodeURIComponent(slug)}?lang=${lang}`,
    );

    if (response.ok) {
      const { data } = await response.json();

      return {
        title: data.meta_title || data.title || slug,
        description: data.meta_description || undefined,
      };
    }
  } catch {
    // API əlçatan olmayanda slug ilə kifayətlənirik
  }

  return { title: slug };
}

export default async function ProductDetail({ params }) {
  const { slug } = await params;

  return <ProductDetailPage slug={slug} />;
}
