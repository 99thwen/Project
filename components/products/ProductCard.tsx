"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const { addToCart } = useCart();

  function handleAddToCart() {
    addToCart(product);
  }
  return (
    <article className="card-hover overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-white shadow-[var(--shadow-sm)]">
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="relative aspect-square overflow-hidden bg-[var(--background-soft)]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="p-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--primary)]">
            {product.brandId}
          </p>

          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold text-[var(--dark)]">
            {product.name}
          </h3>

          {product.model && (
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Model: {product.model}
            </p>
          )}

          <p className="mt-3 text-lg font-bold text-[var(--navy)]">
            Rs. {product.price.toLocaleString("en-PK")}
            {product.priceMax && (
              <> – Rs. {product.priceMax.toLocaleString("en-PK")}</>
            )}
          </p>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <button
        type="button"
        onClick={handleAddToCart}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </article>
  );
}