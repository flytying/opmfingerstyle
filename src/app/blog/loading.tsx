export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="mt-3 h-5 w-80 animate-pulse rounded-lg bg-gray-100" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-border">
            <div className="aspect-[16/9] animate-pulse bg-gray-200" />
            <div className="p-4">
              <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
              <div className="mt-2 h-5 w-full animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-3 w-3/4 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
