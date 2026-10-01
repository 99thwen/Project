export interface ProductColor {
  name: string;
  images?: string[];
}
export interface ProductVariant {
  name: string;
  size?: string;
  price: number;
  image?: string;
  model?: string;
  sku?: string;
  dimensions?: string;
  specifications?: Record<string, string>;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  features?: string[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  categoryId: string;
  brandId: string;
  price: number;
  priceMax?: number;
  image: string;
  images?: string[];
  description?: string;
  specifications?: Record<string, string>;
  variants?: ProductVariant[];
  colors?: ProductColor[];
  model?: string;
}