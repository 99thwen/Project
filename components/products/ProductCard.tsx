"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { brands } from "@/data/brands";
import { categories } from "@/data/categories";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const brand = brands.find(
    (item) => item.id === product.brandId,
  );

  const category = categories.find(
    (item) => item.id === product.categoryId,
  );

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white
        rounded-2xl border border-[var(--border)]
        bg-white
        transition-all duration-300 ease-out
        hover:-translate-y-1
        hover:border-[var(--primary)]/30
        hover:shadow-[var(--shadow-md)]
      "
    >
      {/* PRODUCT IMAGE */}
      <Link
        href={`/product/${product.slug}`}
        className="
          relative block aspect-[1.08/1]
          overflow-hidden
          bg-[var(--background-soft)]
          sm:aspect-square
        "
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="
            object-contain
            scale-[1.08] p-3
            transition-transform duration-500 ease-out
            group-hover:scale-[1.14]
            sm:p-4
            lg:p-5
          "
        />

        {/* BRAND */}
        {brand && (
          <span
            className="
              absolute left-3 top-3
              rounded-full
              border border-white/80
              bg-white/95
              px-2.5 py-1
              text-[9px] font-semibold
              uppercase tracking-[0.08em]
              text-[var(--navy)]
              shadow-sm
              backdrop-blur-sm
              sm:left-4 sm:top-4
              sm:text-[10px]
            "
          >
            {brand.name}
          </span>
        )}

        {/* IMAGE HOVER OVERLAY */}
        <div
          className="
            pointer-events-none absolute inset-0
            bg-gradient-to-t
            from-black/[0.025]
            via-transparent
            to-transparent
            opacity-0
            transition-opacity duration-300
            group-hover:opacity-100
          "
        />
      </Link>

      {/* CONTENT */}
      <div
        className="
          flex flex-1 flex-col
          px-4 pb-4 pt-4
          sm:px-5 sm:pb-5 sm:pt-4
        "
      >
        {/* CATEGORY */}
        {category && (
          <p
            className="
              mb-1.5
              text-[10px] font-semibold
              uppercase tracking-[0.14em]
              text-[var(--text-muted)]
            "
          >
            {category.name}
          </p>
        )}

        {/* PRODUCT NAME */}
        <Link
          href={`/product/${product.slug}`}
          className="
            line-clamp-2
            min-h-[42px]
            text-[14px]
            font-semibold
            leading-[1.45]
            text-[var(--navy)]
            transition-colors duration-200
            hover:text-[var(--primary)]
            sm:min-h-[46px]
            sm:text-[15px]
          "
        >
          {product.name}
        </Link>

        {/* MODEL */}
        {product.model && (
          <p
            className="
              mt-1.5
              truncate
              text-[11px]
              text-[var(--text-muted)]
              sm:text-[12px]
            "
          >
            Model: {product.model}
          </p>
        )}

        {/* BOTTOM CONTENT */}
        <div className="mt-auto pt-4 sm:pt-5">
          {/* PRICE */}
          {product.price > 0 ? (
            <p
              className="
                text-[18px]
                font-semibold
                tracking-tight
                text-[var(--navy)]
                sm:text-[19px]
              "
            >
              Rs. {product.price.toLocaleString("en-PK")}
            </p>
          ) : (
            <p
              className="
                text-[16px]
                font-semibold
                tracking-tight
                text-[var(--navy)]
                sm:text-[17px]
              "
            >
              Price on request
            </p>
          )}

          {/* VIEW PRODUCT */}
          <Link
            href={`/product/${product.slug}`}
            aria-label={`View ${product.name}`}
            className="
              mt-3 flex h-11 w-full
              items-center justify-center
              gap-2
              rounded-xl
              bg-[var(--primary)]
              px-4
              text-[12px]
              font-semibold
              !text-white
              transition-all duration-300 ease-out
              hover:-translate-y-0.5
              hover:bg-[var(--primary-hover)]
              hover:shadow-md
              active:scale-[0.98]
              sm:text-[13px]
            "
          >
            <span className="!text-white">
              View Product
            </span>

            <ArrowUpRight
              className="
                h-4 w-4 shrink-0
                !text-white
                transition-transform duration-300
                group-hover:translate-x-0.5
                group-hover:-translate-y-0.5
              "
            />
          </Link>
        </div>
      </div>
    </article>
  );
}