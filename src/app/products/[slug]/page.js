import ProductDetailPage from "@/components/products/ProductDetailPage";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  return {
    title: "Product Detail",
    description: `Product details for ${slug}`,
  };
}

export default async function ProductDetail({ params }) {
  const { slug } = await params;

  return <ProductDetailPage slug={slug} />;
}
