import ProductDetailPage from "@/components/products/ProductDetailPage";
import { SITE_URL } from "@/constants/site";
import { API_URL } from "@/utils/api";
import { getServerLang } from "@/utils/server-lang";

async function fetchProduct(slug, lang) {
  try {
    const response = await fetch(
      `${API_URL}/products/slug/${encodeURIComponent(slug)}?lang=${lang}`,
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
  const data = await fetchProduct(slug, lang);

  if (!data) {
    return { title: slug, alternates: { canonical: `/products/${slug}` } };
  }

  const images = (data.images ?? [])
    .map((image) => image.url)
    .filter(Boolean)
    .slice(0, 4);

  return {
    title: data.meta_title || data.title || slug,
    description: data.meta_description || undefined,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title: data.meta_title || data.title || slug,
      description: data.meta_description || undefined,
      url: `/products/${slug}`,
      images,
    },
  };
}

function productJsonLd(data, slug) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.title || slug,
    url: `${SITE_URL}/products/${slug}`,
    image: (data.images ?? []).map((image) => image.url).filter(Boolean),
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${slug}`,
      price: Number(data.final_price ?? data.price ?? 0).toFixed(2),
      priceCurrency: "AZN",
      availability: "https://schema.org/InStock",
    },
  };

  if (data.meta_description) {
    jsonLd.description = data.meta_description;
  }

  if (data.rating?.count > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: data.rating.average,
      reviewCount: data.rating.count,
    };
  }

  return jsonLd;
}

export default async function ProductDetail({ params }) {
  const { slug } = await params;
  const lang = await getServerLang();
  const data = await fetchProduct(slug, lang);

  return (
    <>
      {data && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productJsonLd(data, slug)),
          }}
        />
      )}
      <ProductDetailPage slug={slug} />
    </>
  );
}
