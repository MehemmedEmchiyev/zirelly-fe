export default function BlogDetailPage({ slug }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
        Blog Detail
      </h1>
      <p className="mt-4 text-lg text-zinc-600">Slug: {slug}</p>
    </section>
  );
}
