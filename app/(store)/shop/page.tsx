import StoreLayout from "@/components/layout/StoreLayout";
import CategoryCatalog from "@/components/products/CategoryCatalog";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
  }>;
}

export default async function ShopPage({
  searchParams,
}: ShopPageProps) {
  const params = await searchParams;

  const categorySlug = params.category || "";
  const brandSlug = params.brand || "";

  const category = categories.find(
    (item) => item.slug === categorySlug
  );

  const brand = brands.find(
    (item) => item.slug === brandSlug
  );

  return (
    <StoreLayout>
      <section className="bg-[#f8f9fc] py-10">
        <div className="container-main">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-slate-500">
            Home <span className="mx-2">/</span> Shop
          </div>

          <div className="mb-8">
            <p className="section-label">Jaji Electronics</p>

            <h1 className="section-title">
              {category && brand
                ? `${brand.name} ${category.name}`
                : category
                  ? category.name
                  : brand
                    ? `${brand.name} Products`
                    : "Shop All Products"}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Browse our collection of genuine home appliances from
              trusted brands.
            </p>
          </div>

          <CategoryCatalog
            products={products}
            initialCategory={category?.id}
            initialBrand={brand?.id}
          />
        </div>
      </section>
    </StoreLayout>
  );
}

export const metadata = {
  title: "Shop | Jaji Electronics",
  description:
    "Browse home appliances from trusted brands at Jaji Electronics.",
};