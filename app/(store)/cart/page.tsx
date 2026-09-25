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
          <div className="container-main py-12 sm:py-16">
            <div className="mx-auto max-w-2xl rounded-[var(--radius-xl)] border border-[var(--border)] bg-white px-6 py-16 text-center shadow-[var(--shadow-sm)]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-light)]">
                <ShoppingBag className="h-7 w-7 text-[var(--primary)]" />
              </div>

              <h1 className="mt-6 !text-2xl !font-bold text-[var(--dark)] sm:!text-3xl">
                Your cart is empty
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--text-muted)]">
                You haven't added any products to your cart yet.
              </p>

              <Link
                href="/"
                className="mt-7 inline-flex h-11 items-center justify-center rounded-lg bg-[var(--primary)] px-6 text-sm font-bold text-white transition-colors hover:bg-[var(--primary-hover)]"
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
        <div className="container-main py-10 sm:py-12">
          {/* Header */}
          <div className="mb-8">
            <p className="section-label">Shopping Cart</p>

            <h1 className="!text-3xl !font-bold text-[var(--dark)] sm:!text-4xl">
              Your Cart
            </h1>

            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Review your items before proceeding to checkout.
            </p>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* Cart items */}
            <section className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-white shadow-[var(--shadow-sm)]">
              <div className="border-b border-[var(--border-light)] px-5 py-4 sm:px-6">
                <h2 className="text-base font-bold text-[var(--dark)]">
                  Cart Items
                </h2>
              </div>

              <div className="divide-y divide-[var(--border-light)]">
                {items.map((item) => (
                  <article
                    key={item.product.id}
                    className="p-5 sm:p-6"
                  >
                    <div className="flex gap-4 sm:gap-5">
                      {/* Product image */}
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-[var(--background-soft)] sm:h-32 sm:w-32"
                      >
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="128px"
                          className="object-contain p-3"
                        />
                      </Link>

                      {/* Product details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--primary)]">
                              {item.product.brandId}
                            </p>

                            <Link
                              href={`/product/${item.product.slug}`}
                              className="mt-1 block"
                            >
                              <h3 className="line-clamp-2 text-sm font-bold leading-5 text-[var(--dark)] hover:text-[var(--primary)] sm:text-base">
                                {item.product.name}
                              </h3>
                            </Link>

                            {item.product.model && (
                              <p className="mt-1 text-xs text-[var(--text-muted)]">
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
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-red-50 hover:text-[var(--danger)]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                          {/* Quantity */}
                          <div className="flex h-9 items-center overflow-hidden rounded-lg border border-[var(--border)]">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                )
                              }
                              aria-label="Decrease quantity"
                              className="flex h-full w-9 items-center justify-center text-[var(--dark)] hover:bg-[var(--background-soft)]"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>

                            <span className="flex h-full min-w-9 items-center justify-center border-x border-[var(--border)] px-2 text-xs font-bold text-[var(--dark)]">
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
                              className="flex h-full w-9 items-center justify-center text-[var(--dark)] hover:bg-[var(--background-soft)]"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Item price */}
                          <p className="text-base font-bold text-[var(--navy)]">
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
            <aside className="sticky top-28 rounded-[var(--radius-xl)] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-sm)]">
              <h2 className="text-lg font-bold text-[var(--dark)]">
                Order Summary
              </h2>

              <div className="my-5 h-px bg-[var(--border-light)]" />

              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">
                  Subtotal
                </span>

                <span className="font-semibold text-[var(--dark)]">
                  Rs. {subtotal.toLocaleString("en-PK")}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">
                  Delivery
                </span>

                <span className="font-semibold text-[var(--dark)]">
                  Calculated at checkout
                </span>
              </div>

              <div className="my-5 h-px bg-[var(--border-light)]" />

              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-[var(--dark)]">
                  Total
                </span>

                <span className="text-xl font-bold text-[var(--navy)]">
                  Rs. {subtotal.toLocaleString("en-PK")}
                </span>
              </div>

              {/* COD */}
              <div className="mt-5 rounded-lg bg-[var(--primary-light)] p-4">
                <p className="text-sm font-bold text-[var(--dark)]">
                  Cash on Delivery
                </p>

                <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                  Payment will be collected when your order is delivered.
                </p>
              </div>

              {/* Checkout */}
              <Link
                href="/checkout"
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-5 text-sm font-bold text-white transition-colors hover:bg-[var(--primary-hover)]"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/"
                className="mt-4 block text-center text-sm font-semibold text-[var(--navy)] hover:text-[var(--primary)]"
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