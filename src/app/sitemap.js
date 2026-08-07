import { SITE_URL } from "@/constants/site";
import { API_URL } from "@/utils/api";

export const revalidate = 3600;

const MAX_PAGES = 20;

async function fetchAllPages(path) {
  const items = [];

  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const response = await fetch(`${API_URL}${path}&per_page=100&page=${page}`, {
        next: { revalidate: 3600 },
      });

      if (!response.ok) break;

      const json = await response.json();
      items.push(...(json.data ?? []));

      if (page >= (json.meta?.last_page ?? 1)) break;
    }
  } catch {
    return items;
  }

  return items;
}

export default async function sitemap() {
  const staticRoutes = [
    { path: "", priority: 1, changeFrequency: "daily" },
    { path: "/products", priority: 0.9, changeFrequency: "daily" },
    { path: "/blogs", priority: 0.7, changeFrequency: "weekly" },
    { path: "/about", priority: 0.5, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
    { path: "/return-policy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  ].map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const [products, blogs] = await Promise.all([
    fetchAllPages("/products?active=1"),
    fetchAllPages("/blogs?published=1"),
  ]);

  const productRoutes = products
    .filter((product) => product.slug)
    .map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const blogRoutes = blogs
    .filter((blog) => blog.slug)
    .map((blog) => ({
      url: `${SITE_URL}/blogs/${blog.slug}`,
      lastModified: blog.created_at ? new Date(blog.created_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
