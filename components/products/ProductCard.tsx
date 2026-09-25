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
        className="relative block aspect-square overflow-hidden bg-[var(--background-soft)]"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />

        {/* Brand Badge */}
        {brand && (
          <span className="absolute left-3 top-3 rounded-md bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--navy)] shadow-sm">
            {brand.name}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">

        {/* Category */}
        {category && (
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-[var(--text-light)]">
            {category.name}
          </p>
        )}

        {/* Product Name */}
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 min-h-[44px] text-[15px] font-semibold leading-5 text-[var(--navy)] transition-colors hover:text-[var(--primary)]"
        >
          {product.name}
        </Link>

        {/* Model */}
        {product.model && (
          <p className="mt-1 truncate text-xs text-[var(--text-light)]">
            Model: {product.model}
          </p>
        )}

        {/* Bottom */}
        <div className="mt-auto pt-4">

          {/* Price */}
          <div className="mb-3">
            <p className="text-lg font-semibold text-[var(--navy)]">
              Rs. {product.price.toLocaleString("en-PK")}
            </p>
          </div>

          {/* View Product */}
          <Link
            href={`/product/${product.slug}`}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold !text-white shadow-sm transition-all hover:bg-[var(--primary-hover)] hover:shadow-md active:scale-[0.98]"
          >
            <ShoppingCart className="h-4 w-4 !text-white" />
            <span className="!text-white">
              View Product
            </span>
          </Link>

        </div>
      </div>
    </article>
  );
}