"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import StoreLayout from "@/components/layout/StoreLayout";
import { useCart } from "@/components/cart/CartContext";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
  } = useCart();

  if (items.length === 0) {
    return (
      <StoreLayout>
        <main className="bg-[var(--background-soft)]">
          <div className="container-main py-10 sm:py-16">
            <div className="mx-auto max-w-2xl rounded-[var(--radius-xl)] border border-[var(--border)] bg-white px-5 py-12 text-center shadow-[var(--shadow-sm)] sm:px-6 sm:py-16">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary-light)] sm:h-16 sm:w-16">
                <ShoppingBag className="h-6 w-6 text-[var(--primary)] sm:h-7 sm:w-7" />
              </div>

              <h1 className="mt-5 !text-2xl !font-bold text-[var(--dark)] sm:mt-6 sm:!text-3xl">
                Your cart is empty
              </h1>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--text-muted)]">
                You haven't added any products to your cart yet.
              </p>

              <Link
                href="/"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[var(--primary)] px-6 text-sm font-bold !text-white transition-colors hover:bg-[var(--primary-hover)]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <main className="bg-[var(--background-soft)]">
        <div className="container-main py-7 sm:py-12">

          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <p className="section-label">Shopping Cart</p>

            <h1 className="!text-2xl !font-bold text-[var(--dark)] sm:!text-4xl">
              Your Cart
            </h1>

            <p className="mt-1.5 text-sm text-[var(--text-muted)] sm:mt-2">
              Review your items before proceeding to checkout.
            </p>
          </div>

          <div className="grid items-start gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">

            {/* Cart items */}
            <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-[var(--shadow-sm)] sm:rounded-[var(--radius-xl)]">

              <div className="border-b border-[var(--border-light)] px-4 py-3.5 sm:px-6 sm:py-4">
                <h2 className="text-[15px] font-bold text-[var(--dark)] sm:text-base">
                  Cart Items
                </h2>
              </div>

              <div className="divide-y divide-[var(--border-light)]">
                {items.map((item) => (
                  <article
                    key={item.product.id}
                    className="p-4 sm:p-6"
                  >
                    <div className="flex gap-3 sm:gap-5">

                      {/* Product image */}
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="relative h-[92px] w-[92px] shrink-0 overflow-hidden rounded-lg bg-[var(--background-soft)] sm:h-32 sm:w-32"
                      >
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="128px"
                          className="object-contain p-2.5 sm:p-3"
                        />
                      </Link>

                      {/* Product details */}
                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">

                            <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--primary)] sm:text-[10px] sm:tracking-[0.1em]">
                              {item.product.brandId}
                            </p>

                            <Link
                              href={`/product/${item.product.slug}`}
                              className="mt-0.5 block sm:mt-1"
                            >
                              <h3 className="line-clamp-2 text-[13px] font-bold leading-[18px] text-[var(--dark)] hover:text-[var(--primary)] sm:text-base sm:leading-5">
                                {item.product.name}
                              </h3>
                            </Link>

                            {item.product.model && (
                              <p className="mt-0.5 truncate text-[10px] text-[var(--text-muted)] sm:mt-1 sm:text-xs">
                                Model: {item.product.model}
                              </p>
                            )}
                          </div>

                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(item.product.id)
                            }
                            aria-label={`Remove ${item.product.name}`}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-red-50 hover:text-[var(--danger)] sm:h-8 sm:w-8 sm:rounded-lg"
                          >
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 sm:mt-4 sm:gap-4">

                          {/* Quantity */}
                          <div className="flex h-8 items-center overflow-hidden rounded-md border border-[var(--border)] sm:h-9 sm:rounded-lg">

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                )
                              }
                              aria-label="Decrease quantity"
                              className="flex h-full w-8 items-center justify-center text-[var(--dark)] hover:bg-[var(--background-soft)] sm:w-9"
                            >
                              <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            </button>

                            <span className="flex h-full min-w-8 items-center justify-center border-x border-[var(--border)] px-1.5 text-xs font-bold text-[var(--dark)] sm:min-w-9 sm:px-2">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                )
                              }
                              aria-label="Increase quantity"
                              className="flex h-full w-8 items-center justify-center text-[var(--dark)] hover:bg-[var(--background-soft)] sm:w-9"
                            >
                              <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            </button>

                          </div>

                          {/* Item price */}
                          <p className="text-[15px] font-bold text-[var(--navy)] sm:text-base">
                            Rs.{" "}
                            {(
                              item.product.price *
                              item.quantity
                            ).toLocaleString("en-PK")}
                          </p>

                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Order summary */}
            <aside className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)] sm:sticky sm:top-28 sm:rounded-[var(--radius-xl)] sm:p-6">

              <h2 className="text-[17px] font-bold text-[var(--dark)] sm:text-lg">
                Order Summary
              </h2>

              <div className="my-4 h-px bg-[var(--border-light)] sm:my-5" />

              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">
                  Subtotal
                </span>

                <span className="font-semibold text-[var(--dark)]">
                  Rs. {subtotal.toLocaleString("en-PK")}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 text-sm sm:mt-4">
                <span className="text-[var(--text-muted)]">
                  Delivery
                </span>

                <span className="text-right text-xs font-semibold text-[var(--dark)] sm:text-sm">
                  Calculated at checkout
                </span>
              </div>

              <div className="my-4 h-px bg-[var(--border-light)] sm:my-5" />

              <div className="flex items-center justify-between">
                <span className="text-[15px] font-bold text-[var(--dark)] sm:text-base">
                  Total
                </span>

                <span className="text-xl font-bold text-[var(--navy)] sm:text-xl">
                  Rs. {subtotal.toLocaleString("en-PK")}
                </span>
              </div>

              {/* COD */}
              <div className="mt-4 rounded-lg bg-[var(--primary-light)] p-3 sm:mt-5 sm:p-4">
                <p className="text-[13px] font-bold text-[var(--dark)] sm:text-sm">
                  Cash on Delivery
                </p>

                <p className="mt-0.5 text-[11px] leading-5 text-[var(--text-muted)] sm:mt-1 sm:text-xs">
                  Payment will be collected when your order is delivered.
                </p>
              </div>

              {/* Checkout */}
              <Link
                href="/checkout"
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 text-[13px] font-bold !text-white transition-colors hover:bg-[var(--primary-hover)] sm:mt-5 sm:h-12 sm:px-5 sm:text-sm"
              >
                <span className="!text-white">
                  Proceed to Checkout
                </span>

                <ArrowRight className="h-4 w-4 !text-white" />
              </Link>

              <Link
                href="/"
                className="mt-3 block text-center text-[13px] font-semibold text-[var(--navy)] hover:text-[var(--primary)] sm:mt-4 sm:text-sm"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        </div>
      </main>
    </StoreLayout>
  );
}