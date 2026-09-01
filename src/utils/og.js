// Admin paneldəki OG sahələrindən Next.js openGraph metadata qurur.
// og_title/og_description boş olanda meta sahələrinə, sonra defolta düşür.
export function buildOpenGraph(data, { url, title, description, fallbackImage } = {}) {
  const ogTitle = data?.og_title || data?.meta_title || title;
  const ogDescription = data?.og_description || data?.meta_description || description;
  const imageUrl = data?.og_image?.url || fallbackImage;

  return {
    ...(ogTitle ? { title: ogTitle } : {}),
    ...(ogDescription ? { description: ogDescription } : {}),
    ...(url ? { url } : {}),
    ...(imageUrl
      ? { images: [{ url: imageUrl, width: 1200, height: 630 }] }
      : {}),
  };
}
