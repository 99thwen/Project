
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

  model?: string;
}