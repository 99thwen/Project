import Image from "next/image";
import Link from "next/link";

import { categories } from "@/data/categories";

export default function CategorySection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
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
            className="hidden shrink-0 text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] sm:block"
          >
            View all categories →
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((category) => (
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
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
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

        {/* Mobile View All */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/shop"
            className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]"
          >
            View all categories →
          </Link>
        </div>
      </div>
    </section>
  );
}