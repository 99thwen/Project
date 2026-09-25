import { notFound } from "next/navigation";

import StoreLayout from "@/components/layout/StoreLayout";
import CategoryCatalog from "@/components/products/CategoryCatalog";
import { brands } from "@/data/brands";
import { products } from "@/data/products";

interface BrandPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;

  const brand = brands.find((item) => item.slug === slug);

  if (!brand) {
    notFound();
  }

  const brandProducts = products.filter(
    (product) => product.brandId === brand.id
  );

  return (
    <StoreLayout>
      <main className="bg-slate-50">
        <section className="container-main py-10 sm:py-14">
          <div className="mb-8">
            <div className="mb-3 text-sm text-slate-500">
              Home <span className="mx-2">/</span> Brands{" "}
              <span className="mx-2">/</span> {brand.name}
            </div>

            <p className="section-label">Shop by Brand</p>

            <h1 className="!text-3xl !font-bold text-slate-900 sm:!text-4xl">
              {brand.name}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Explore {brand.name} products available at Jaji Electronics.
            </p>
          </div>

          {brandProducts.length > 0 ? (
            <CategoryCatalog products={brandProducts} />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
              <h2 className="!text-xl !font-semibold text-slate-900">
                No products available yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Products from {brand.name} will appear here once they are added
                to the catalogue.
              </p>
            </div>
          )}
        </section>
      </main>
    </StoreLayout>
  );
}

export async function generateMetadata({ params }: BrandPageProps) {
  const { slug } = await params;

  const brand = brands.find((item) => item.slug === slug);

  if (!brand) {
    return {
      title: "Brand Not Found | Jaji Electronics",
    };
  }

  return {
    title: `${brand.name} | Jaji Electronics`,
    description: `Shop ${brand.name} products at Jaji Electronics.`,
  };
}