import { notFound } from "next/navigation";

import ProductGrid from "@/components/products/ProductGrid";
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
      <section className="section-padding bg-[var(--background-soft)]">
        <div className="container-main">
          <div className="section-header">
            <p className="section-label">Category</p>

            <h1 className="section-title">
              {category.name}
            </h1>

            <p className="section-description">
              Browse our {category.name.toLowerCase()} collection.
            </p>
          </div>

          {categoryProducts.length > 0 ? (
            <ProductGrid products={categoryProducts} />
          ) : (
            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-10 text-center">
              <p className="text-sm text-[var(--text-muted)]">
                No products are available in this category yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </StoreLayout>
  );
}