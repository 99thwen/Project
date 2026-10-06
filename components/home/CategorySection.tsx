import Image from "next/image";
import Link from "next/link";

import { ChevronRight } from "lucide-react";

import { categories } from "@/data/categories";

export default function CategorySection() {
  const homeCategorySlugs = [
    "split-ac",
    "washing-machine",
    "microwave",
    "refrigerator",
    "deep-freezer",
    "dispenser",
    "air-cooler",
  ];

  const homeCategories = homeCategorySlugs
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter(
      (category): category is (typeof categories)[number] =>
        Boolean(category)
    );

  return (
    <section
  id="shop-by-category"
  className="section-padding scroll-mt-24 bg-white"
>
      <div className="container-main">

        {/* =====================================================
            DESKTOP / TABLET
        ====================================================== */}
        <div className="hidden sm:block">

          {/* Section Header */}
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="section-label">Shop by Category</p>

              <h2 className="section-title">
                Everything for your home
              </h2>
            </div>

            <Link
              href="/shop"
              className="shrink-0 text-sm font-semibold text-[var(--primary)] transition-colors hover:text-[var(--primary-hover)]"
            >
              View all categories →
            </Link>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {homeCategories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="card-hover group overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-white shadow-[var(--shadow-sm)]"
              >
                {/* Category Image */}
                <div className="relative aspect-square overflow-hidden bg-[var(--background-soft)]">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Category Name */}
                <div className="border-t border-[var(--border-light)] px-4 py-4">
                  <h3 className="text-center text-sm font-semibold leading-5 text-[var(--dark)] transition-colors group-hover:text-[var(--primary)]">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* =====================================================
            MOBILE
        ====================================================== */}
        <div className="sm:hidden">

          {/* Mobile Section Header */}
          <div className="mb-5">
            <p className="section-label">Shop by Category</p>

            <h2 className="section-title">
              Everything for your home
            </h2>
          </div>

          {/* Mobile Category List */}
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-white">
            {homeCategories.map((category, index) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className={`group flex min-h-[72px] items-center gap-3 px-3 py-2.5 transition-colors hover:bg-[var(--background-soft)] ${
                  index !== homeCategories.length - 1
                    ? "border-b border-[var(--border-light)]"
                    : ""
                }`}
              >
                {/* Small Category Image */}
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[var(--background-soft)]">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="48px"
                    className="object-contain p-1.5"
                  />
                </div>

                {/* Category Name */}
                <span className="min-w-0 flex-1 text-sm font-semibold text-[var(--dark)] transition-colors group-hover:text-[var(--primary)]">
                  {category.name}
                </span>

                {/* Arrow */}
                <ChevronRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--primary)]" />
              </Link>
            ))}
          </div>

          {/* Mobile View All */}
          <div className="mt-5 text-center">
            <Link
              href="/shop"
              className="text-sm font-semibold text-[var(--primary)] transition-colors hover:text-[var(--primary-hover)]"
            >
              View all categories →
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}