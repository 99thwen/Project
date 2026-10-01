import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({
  products,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}