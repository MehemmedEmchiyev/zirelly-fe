import BlogDetailPage from "@/components/blogs/BlogDetailPage";
import { SITE_URL } from "@/constants/site";
import { API_URL } from "@/utils/api";
import { getServerLang } from "@/utils/server-lang";

async function fetchBlog(slug, lang) {
  try {
    const response = await fetch(
      `${API_URL}/blogs/slug/${encodeURIComponent(slug)}?lang=${lang}`,
    );

    if (response.ok) {
      const { data } = await response.json();
      return data;
    }
  } catch {
    return null;
  }

  return null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const lang = await getServerLang();
  const data = await fetchBlog(slug, lang);

  if (!data) {
    return { title: slug, alternates: { canonical: `/blogs/${slug}` } };
  }

  return {
    title: data.meta_title || data.title || slug,
    description: data.meta_description || undefined,
    alternates: { canonical: `/blogs/${slug}` },
    openGraph: {
      type: "article",
      title: data.meta_title || data.title || slug,
      description: data.meta_description || undefined,
      url: `/blogs/${slug}`,
      images: data.image ? [data.image] : [],
      publishedTime: data.created_at || undefined,
    },
  };
}

function blogJsonLd(data, slug) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title || slug,
    url: `${SITE_URL}/blogs/${slug}`,
    mainEntityOfPage: `${SITE_URL}/blogs/${slug}`,
    author: {
      "@type": "Organization",
      name: "Zirelly",
    },
    publisher: {
      "@type": "Organization",
      name: "Zirelly",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.svg`,
      },
    },
  };

  if (data.image) {
    jsonLd.image = [data.image];
  }

  if (data.created_at) {
    jsonLd.datePublished = data.created_at;
  }

  if (data.meta_description) {
    jsonLd.description = data.meta_description;
  }

  return jsonLd;
}

export default async function BlogDetail({ params }) {
  const { slug } = await params;
  const lang = await getServerLang();
  const data = await fetchBlog(slug, lang);

  return (
    <>
      {data && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(blogJsonLd(data, slug)),
          }}
        />
      )}
      <BlogDetailPage slug={slug} />
    </>
  );
}
