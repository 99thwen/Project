"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  MapPin,
  Phone,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import { useCart } from "@/components/cart/CartContext";
import StoreLayout from "@/components/layout/StoreLayout";
import { createOrder } from "@/lib/orders";
import type { Order } from "@/types/order";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();

  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [orderId, setOrderId] = useState<string | null>(
    null,
  );

  if (items.length === 0 && !orderId) {
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
                Add a product to your cart before
                proceeding to checkout.
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

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setIsSubmitting(true);

    const formData = new FormData(
      event.currentTarget,
    );

    const order: Order = {
      id: `order-${Date.now()}`,

      customer: {
        name: String(formData.get("name") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        address: String(
          formData.get("address") ?? "",
        ),
      },

      items: items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),

      subtotal,

      paymentMethod: "cod",

      status: "pending",

      createdAt: new Date().toISOString(),
    };

    const createdOrder = await createOrder(order);

    setOrderId(createdOrder.id);
    clearCart();
    setIsSubmitting(false);
  }

  if (orderId) {
    return (
      <StoreLayout>
        <main className="bg-[var(--background-soft)]">
          <div className="container-main py-12 sm:py-16">
            <div className="mx-auto max-w-2xl rounded-[var(--radius-xl)] border border-[var(--border)] bg-white px-6 py-14 text-center shadow-[var(--shadow-sm)]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Check className="h-8 w-8" />
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.12em] text-[var(--primary)]">
                Jaji Electronics
              </p>

              <h1 className="mt-2 !text-3xl !font-bold text-[var(--dark)]">
                Order Received
              </h1>

              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[var(--text-muted)]">
                Thank you for your order. We will
                contact you to confirm the order and
                delivery details.
              </p>

              <div className="mx-auto mt-7 max-w-sm rounded-xl bg-[var(--background-soft)] p-5">
                <p className="text-xs text-[var(--text-muted)]">
                  Order ID
                </p>

                <p className="mt-1 text-base font-bold text-[var(--dark)]">
                  {orderId}
                </p>

                <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-[var(--navy)]">
                  <Check className="h-4 w-4 text-green-600" />
                  Cash on Delivery
                </div>
              </div>

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
            <Link
              href="/cart"
              className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--navy)] hover:text-[var(--primary)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </Link>

            <p className="section-label">
              Checkout
            </p>

            <h1 className="section-title">
              Complete Your Order
            </h1>

            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Enter your delivery details and place
              your order with Cash on Delivery.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]"
          >
            {/* Customer information */}
            <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-white shadow-[var(--shadow-sm)]">
              <div className="border-b border-[var(--border-light)] px-6 py-5 sm:px-8">
                <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--dark)]">
                  <UserRound className="h-5 w-5 text-[var(--primary)]" />
                  Delivery Information
                </h2>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Please provide accurate information
                  for your order.
                </p>
              </div>

              <div className="space-y-5 p-6 sm:p-8">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-[var(--dark)]"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Enter your full name"
                    className="h-12 w-full rounded-lg border border-[var(--border)] bg-white px-4 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-[var(--dark)]"
                  >
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="03XX XXXXXXX"
                      className="h-12 w-full rounded-lg border border-[var(--border)] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-semibold text-[var(--dark)]"
                  >
                    Delivery Address
                  </label>

                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-[var(--text-muted)]" />

                    <textarea
                      id="address"
                      name="address"
                      required
                      rows={5}
                      autoComplete="street-address"
                      placeholder="Enter your complete delivery address"
                      className="w-full resize-y rounded-lg border border-[var(--border)] bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                    />
                  </div>
                </div>

                {/* Payment */}
                <div>
                  <p className="mb-2 text-sm font-semibold text-[var(--dark)]">
                    Payment Method
                  </p>

                  <div className="flex items-start gap-3 rounded-xl border border-[var(--primary)] bg-[var(--primary-light)] p-4">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                      <Check className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[var(--dark)]">
                        Cash on Delivery
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                        Pay when your order is delivered.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-lg bg-[var(--primary)] px-5 text-sm font-bold text-white transition-all hover:bg-[var(--primary-hover)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Placing Order..."
                    : "Place Order"}
                </button>

                <p className="text-center text-xs leading-5 text-[var(--text-muted)]">
                  By placing this order, you confirm
                  that your delivery information is
                  correct.
                </p>
              </div>
            </div>

            {/* Order summary */}
            <aside className="sticky top-28 h-fit rounded-[var(--radius-xl)] border border-[var(--border)] bg-white shadow-[var(--shadow-sm)]">
              <div className="border-b border-[var(--border-light)] px-6 py-5">
                <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--dark)]">
                  <ShoppingBag className="h-5 w-5 text-[var(--primary)]" />
                  Order Summary
                </h2>
              </div>

              <div className="p-6">
                <div className="space-y-5">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold leading-5 text-[var(--dark)]">
                          {item.product.name}
                        </p>

                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-semibold text-[var(--dark)]">
                        Rs.{" "}
                        {(
                          item.product.price *
                          item.quantity
                        ).toLocaleString("en-PK")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="my-6 h-px bg-[var(--border-light)]" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">
                    Subtotal
                  </span>

                  <span className="text-sm font-semibold text-[var(--dark)]">
                    Rs.{" "}
                    {subtotal.toLocaleString(
                      "en-PK",
                    )}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">
                    Payment
                  </span>

                  <span className="text-sm font-semibold text-[var(--dark)]">
                    Cash on Delivery
                  </span>
                </div>

                <div className="my-6 h-px bg-[var(--border-light)]" />

                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-[var(--dark)]">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-[var(--navy)]">
                    Rs.{" "}
                    {subtotal.toLocaleString(
                      "en-PK",
                    )}
                  </span>
                </div>

                <div className="mt-5 rounded-lg bg-[var(--background-soft)] p-4">
                  <p className="text-xs font-semibold text-[var(--dark)]">
                    Cash on Delivery
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                    No online payment is required.
                    Pay when your order arrives.
                  </p>
                </div>
              </div>
            </aside>
          </form>
        </div>
      </main>
    </StoreLayout>
  );
}