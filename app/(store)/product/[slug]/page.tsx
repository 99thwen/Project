import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import StoreLayout from "@/components/layout/StoreLayout";
import ProductDetails from "@/components/products/ProductDetails";
import { products } from "@/data/products";
import { categories } from "@/data/categories";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found | Jaji Electronics",
    };
  }

  return {
    title: `${product.name} | Jaji Electronics`,
    description:
      product.description ||
      `View ${product.name} at Jaji Electronics.`,
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const category = categories.find(
    (item) => item.id === product.categoryId,
  );

  return (
    <StoreLayout>
      <main className="bg-[var(--background-soft)]">
        <div className="container-main py-8 sm:py-10 lg:py-12">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]"
          >
            <Link
              href="/"
              className="hover:text-[var(--primary)]"
            >
              Home
            </Link>

            <ChevronRight className="h-3.5 w-3.5" />

            {category && (
              <>
                <Link
                  href={`/category/${category.slug}`}
                  className="hover:text-[var(--primary)]"
                >
                  {category.name}
                </Link>

                <ChevronRight className="h-3.5 w-3.5" />
              </>
            )}

            <span className="font-medium text-[var(--dark)]">
              {product.name}
            </span>
          </nav>

          <ProductDetails product={product} />
        </div>
      </main>
    </StoreLayout>
  );
}