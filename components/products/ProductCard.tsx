"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { brands } from "@/data/brands";
import { categories } from "@/data/categories";
import type { Product } from "@/types/product";
import { useCart } from "@/components/cart/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const brand = brands.find(
    (item) => item.id === product.brandId
  );

  const category = categories.find(
    (item) => item.id === product.categoryId
  );

  function handleAddToCart() {
    addToCart(product);
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-white transition-all duration-200 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-[var(--shadow-md)]">

      {/* Product Image */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[1.12/1] overflow-hidden bg-[var(--background-soft)] sm:aspect-square"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-105 sm:p-4"
        />

        {/* Brand Badge */}
        {brand && (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-white px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-[var(--navy)] shadow-sm sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[10px]">
            {brand.name}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">

        {/* Category */}
        {category && (
          <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-[var(--text-light)] sm:text-[11px]">
            {category.name}
          </p>
        )}

        {/* Product Name */}
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 min-h-[40px] text-[14px] font-semibold leading-5 text-[var(--navy)] transition-colors hover:text-[var(--primary)] sm:min-h-[44px] sm:text-[15px]"
        >
          {product.name}
        </Link>

        {/* Model */}
        {product.model && (
          <p className="mt-1 truncate text-[11px] text-[var(--text-light)] sm:text-xs">
            Model: {product.model}
          </p>
        )}

        {/* Bottom */}
        <div className="mt-auto pt-3 sm:pt-4">

          {/* Price */}
          <div className="mb-2.5 sm:mb-3">
            <p className="text-[17px] font-semibold text-[var(--navy)] sm:text-lg">
              Rs. {product.price.toLocaleString("en-PK")}
            </p>
          </div>

          {/* View Product */}
          <Link
            href={`/product/${product.slug}`}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)] px-2.5 py-2.5 text-[13px] font-semibold !text-white shadow-sm transition-all hover:bg-[var(--primary-hover)] hover:shadow-md active:scale-[0.98] sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
          >
            <ShoppingCart className="h-4 w-4 shrink-0 !text-white" />
            <span className="!text-white">
              View Product
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}