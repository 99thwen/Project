import BrandSection from "@/components/home/BrandSection";
import CategorySection from "@/components/home/CategorySection";
import ProductGrid from "@/components/products/ProductGrid";
import StoreLayout from "@/components/layout/StoreLayout";
import WhyShopWithJaji from "@/components/home/WhyShopWithJaji";
import Hero from "@/components/home/Hero";
import { products } from "@/data/products";


export default function HomePage() {
  return (

    <StoreLayout>
       <Hero />
      <CategorySection />

      <WhyShopWithJaji />
      <BrandSection />
    </StoreLayout>
  );
}