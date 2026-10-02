export default function CategoryLoading() {
  return (
    <main className="bg-slate-50">
      <section className="container-main py-10 sm:py-14">

        {/* Breadcrumb */}
        <div className="mb-3 h-4 w-48 animate-pulse rounded bg-slate-200" />

        {/* Heading */}
        <div className="mb-2 h-4 w-28 animate-pulse rounded bg-slate-200" />
        <div className="h-10 w-56 animate-pulse rounded bg-slate-200 sm:h-12" />

        {/* Description */}
        <div className="mt-3 h-4 w-full max-w-2xl animate-pulse rounded bg-slate-200" />

        {/* Catalog controls */}
        <div className="mt-8">

          {/* Product count + Sort */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />

            <div className="h-10 w-40 animate-pulse rounded-xl bg-slate-200" />
          </div>

          {/* Filter buttons */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="h-11 w-28 animate-pulse rounded-xl bg-slate-200" />
            <div className="h-11 w-24 animate-pulse rounded-xl bg-slate-200" />
            <div className="h-11 w-24 animate-pulse rounded-xl bg-slate-200" />
          </div>
        </div>

        {/* Product grid */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <article
              key={index}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              {/* Product image */}
              <div className="aspect-[1.08/1] animate-pulse bg-slate-200 sm:aspect-square" />

              {/* Product content */}
              <div className="flex flex-1 flex-col px-4 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-4">

                {/* Category */}
                <div className="mb-2 h-3 w-24 animate-pulse rounded bg-slate-200" />

                {/* Product name */}
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                </div>

                {/* Model */}
                <div className="mt-2 h-3 w-28 animate-pulse rounded bg-slate-200" />

                {/* Price + button */}
                <div className="mt-auto pt-4 sm:pt-5">
                  <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />

                  <div className="mt-3 h-11 w-full animate-pulse rounded-xl bg-slate-200" />
                </div>
              </div>
            </article>
          ))}
        </div>

      </section>
    </main>
  );
}