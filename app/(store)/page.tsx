import BrandSection from "@/components/home/BrandSection";
import CategorySection from "@/components/home/CategorySection";
import ProductGrid from "@/components/products/ProductGrid";
import StoreLayout from "@/components/layout/StoreLayout";
import { products } from "@/data/products";

export default function HomePage() {
  return (
    <StoreLayout>
      <CategorySection />

      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="section-header flex items-end justify-between gap-4">
            <div>
              <p className="section-label">Featured Products</p>

              <h2 className="section-title">
                Popular products
              </h2>
            </div>
          </div>

          <ProductGrid products={products} />
        </div>
      </section>

      <BrandSection />
    </StoreLayout>
  );
}