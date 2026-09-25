export default function BrandLoading() {
  return (
    <main className="bg-slate-50">
      <section className="container-main py-10 sm:py-14">
        {/* Breadcrumb skeleton */}
        <div className="mb-3 h-4 w-48 animate-pulse rounded bg-slate-200" />

        {/* Heading skeleton */}
        <div className="mb-2 h-4 w-28 animate-pulse rounded bg-slate-200" />
        <div className="h-10 w-48 animate-pulse rounded bg-slate-200 sm:h-12" />

        {/* Description skeleton */}
        <div className="mt-3 h-4 w-full max-w-2xl animate-pulse rounded bg-slate-200" />

        {/* Catalogue toolbar skeleton */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-10 w-28 animate-pulse rounded-lg bg-slate-200" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
          {/* Sidebar skeleton */}
          <aside className="hidden lg:block">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />

              <div className="mt-6 space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-4 w-4 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 flex-1 animate-pulse rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Product grid skeleton */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                {/* Image */}
                <div className="aspect-[4/4.5] animate-pulse bg-slate-200" />

                <div className="p-4 sm:p-5">
                  {/* Brand */}
                  <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />

                  {/* Product name */}
                  <div className="mt-3 space-y-2">
                    <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                  </div>

                  {/* Model */}
                  <div className="mt-3 h-3 w-24 animate-pulse rounded bg-slate-200" />

                  {/* Price + button */}
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div className="h-5 w-20 animate-pulse rounded bg-slate-200" />
                    <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}