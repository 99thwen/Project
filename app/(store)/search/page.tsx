import Link from "next/link";
import { Search } from "lucide-react";

import ProductGrid from "@/components/products/ProductGrid";
import StoreLayout from "@/components/layout/StoreLayout";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();

  const normalizedQuery = query.toLowerCase();

  const results = normalizedQuery
    ? products.filter((product) => {
        const category = categories.find(
          (item) => item.id === product.categoryId,
        );

        const brand = brands.find(
          (item) => item.id === product.brandId,
        );

        const searchableText = [
          product.name,
          product.model ?? "",
          product.brandId,
          brand?.name ?? "",
          product.description ?? "",
          category?.name ?? "",
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedQuery);
      })
    : [];

  return (
    <StoreLayout>
      <main className="bg-[var(--background-soft)]">
        <div className="container-main py-10 sm:py-12">

          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="text-sm font-semibold text-[var(--navy)] hover:text-[var(--primary)]"
            >
              ← Back to Home
            </Link>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-light)]">
                <Search className="h-5 w-5 text-[var(--primary)]" />
              </div>

              <div>
                <p className="section-label">
                  Search
                </p>

                <h1 className="section-title">
                  {query
                    ? `Search results for "${query}"`
                    : "Search Products"}
                </h1>
              </div>
            </div>

            {query && (
              <p className="mt-3 text-sm text-[var(--text-muted)]">
                {results.length === 1
                  ? "1 product found"
                  : `${results.length} products found`}
              </p>
            )}
          </div>

          {/* Results */}
          {query && results.length > 0 ? (
            <ProductGrid products={results} />
          ) : query ? (
            <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-white px-6 py-16 text-center shadow-[var(--shadow-sm)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--background-soft)]">
                <Search className="h-6 w-6 text-[var(--text-muted)]" />
              </div>

              <h2 className="mt-5 !text-xl !font-bold text-[var(--dark)]">
                No products found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--text-muted)]">
                We couldn't find any products matching
                "{query}". Try searching for another
                product, brand, or model.
              </p>

              <Link
                href="/"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[var(--primary)] px-6 text-sm font-bold text-white hover:bg-[var(--primary-hover)]"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-white px-6 py-16 text-center shadow-[var(--shadow-sm)]">
              <h2 className="!text-xl !font-bold text-[var(--dark)]">
                What are you looking for?
              </h2>

              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Search for a product, brand, or model.
              </p>
            </div>
          )}
        </div>
      </main>
    </StoreLayout>
  );
}