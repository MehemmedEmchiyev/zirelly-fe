import BlogDetailPage from "@/components/blogs/BlogDetailPage";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  return {
    title: slug,
    description: `Blog post: ${slug}`,
  };
}

export default async function BlogDetail({ params }) {
  const { slug } = await params;

  return <BlogDetailPage slug={slug} />;
}
