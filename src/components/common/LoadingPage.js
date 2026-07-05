export default function LoadingPage() {
  return (
    <section className="mx-auto flex max-w-7xl items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" />
        <p className="text-sm text-zinc-500">Loading...</p>
      </div>
    </section>
  );
}
