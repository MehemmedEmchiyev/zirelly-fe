import BlogDetailPage from "@/components/blogs/BlogDetailPage";
import { API_URL } from "@/utils/api";
import { getServerLang } from "@/utils/server-lang";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const lang = await getServerLang();

  try {
    const response = await fetch(
      `${API_URL}/blogs/slug/${encodeURIComponent(slug)}?lang=${lang}`,
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

export default async function BlogDetail({ params }) {
  const { slug } = await params;

  return <BlogDetailPage slug={slug} />;
}
