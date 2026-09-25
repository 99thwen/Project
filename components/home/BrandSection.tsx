import Link from "next/link";

import { brands } from "@/data/brands";

export default function BrandSection() {

  return (

    <section className="section-padding bg-[var(--background-soft)]">

      <div className="container-main">

        {/* Section Header */}

        <div className="mb-8 flex items-end justify-between gap-4">

          <div>

            <p className="section-label">Shop by Brand</p>

            <h2 className="section-title">

              Shop by brand

            </h2>

          </div>

          <Link

            href="/shop"

            className="hidden shrink-0 text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] sm:block"

          >

            View all 12 brands →

          </Link>

        </div>

        {/* Brand Grid */}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">

          {brands.map((brand) => (

            <Link

              key={brand.id}

              href={`/brand/${brand.slug}`}

              className="card-hover group flex min-h-16 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-light)] bg-white px-4 py-4 text-center shadow-[var(--shadow-sm)]"

            >

              <span className="text-sm font-semibold text-[var(--dark)] transition-colors group-hover:text-[var(--primary)]">

                {brand.name}

              </span>

            </Link>

          ))}

        </div>

        {/* Mobile View All */}

        <div className="mt-6 text-center sm:hidden">

          <Link

            href="/shop"

            className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]"

          >

            View all 13 brands →

          </Link>

        </div>

      </div>

    </section>

  );

}