import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import CategoryCatalog from "@/components/products/CategoryCatalog";
import StoreLayout from "@/components/layout/StoreLayout";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;

  const category = categories.find(
    (item) => item.slug === slug,
  );

  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter(
    (product) => product.categoryId === category.id,
  );

  return (
    <StoreLayout>
      <section className="bg-[var(--background-soft)] py-10 sm:py-12 lg:py-14">
        <div className="container-main">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 text-xs text-[var(--text-muted)]"
          >
            <Link
              href="/"
              className="hover:text-[var(--primary)]"
            >
              Home
            </Link>

            <ChevronRight className="h-3.5 w-3.5" />

            <span className="font-medium text-[var(--dark)]">
              {category.name}
            </span>
          </nav>

          {/* Category heading */}
          <div className="mb-8">
            <p className="section-label">Category</p>

            <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="section-title">
                  {category.name}
                </h1>

                <p className="section-description">
                  Browse our {category.name.toLowerCase()} collection.
                </p>
              </div>

              <p className="text-sm text-[var(--text-muted)]">
                {categoryProducts.length}{" "}
                {categoryProducts.length === 1
                  ? "product"
                  : "products"}
              </p>
            </div>
          </div>

          <CategoryCatalog products={categoryProducts} />
        </div>
      </section>
    </StoreLayout>
  );
}