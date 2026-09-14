"use client";

import { useState } from "react";
import Link from "next/link";

import { useCart } from "@/components/cart/CartContext";
import StoreLayout from "@/components/layout/StoreLayout";
import { createOrder } from "@/lib/orders";
import type { Order } from "@/types/order";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  if (items.length === 0 && !orderId) {
    return (
      <StoreLayout>
        <section className="section-padding bg-[var(--background-soft)]">
          <div className="container-main">
            <div className="mx-auto max-w-2xl rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-white p-10 text-center shadow-[var(--shadow-sm)]">
              <h1 className="text-2xl font-bold text-[var(--dark)]">
                Your cart is empty
              </h1>

              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Add a product before proceeding to checkout.
              </p>

              <Link
                href="/shop"
                className="mt-6 inline-flex rounded-lg bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </section>
      </StoreLayout>
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const order: Order = {
      id: `order-${Date.now()}`,

      customer: {
        name: String(formData.get("name") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        address: String(formData.get("address") ?? ""),
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
        <section className="section-padding bg-[var(--background-soft)]">
          <div className="container-main">
            <div className="mx-auto max-w-2xl rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-white p-10 text-center shadow-[var(--shadow-sm)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-xl text-green-600">
                ✓
              </div>

              <h1 className="mt-5 text-2xl font-bold text-[var(--dark)]">
                Order Received
              </h1>

              <p className="mt-3 text-sm text-[var(--text-muted)]">
                Thank you for your order. We will contact you
                to confirm your order.
              </p>

              <p className="mt-4 text-sm font-semibold text-[var(--dark)]">
                Order ID: {orderId}
              </p>

              <p className="mt-2 text-xs text-[var(--text-muted)]">
                Payment method: Cash on Delivery
              </p>

              <Link
                href="/shop"
                className="mt-6 inline-flex rounded-lg bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </section>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <section className="section-padding bg-[var(--background-soft)]">
        <div className="container-main">
          <div className="mb-8">
            <p className="section-label">Checkout</p>

            <h1 className="section-title">
              Complete Your Order
            </h1>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-white p-6 shadow-[var(--shadow-sm)]">
              <h2 className="text-lg font-semibold text-[var(--dark)]">
                Customer Information
              </h2>

              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-5"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-[var(--dark)]"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className="h-11 w-full rounded-lg border border-[var(--border)] px-4 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-[var(--dark)]"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="03XX XXXXXXX"
                    className="h-11 w-full rounded-lg border border-[var(--border)] px-4 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium text-[var(--dark)]"
                  >
                    Delivery Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    required
                    rows={4}
                    placeholder="Enter your complete delivery address"
                    className="w-full rounded-lg border border-[var(--border)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-[var(--dark)]">
                    Payment Method
                  </p>

                  <div className="rounded-lg border border-[var(--primary)] bg-[var(--primary-light)] p-4">
                    <p className="text-sm font-semibold text-[var(--dark)]">
                      Cash on Delivery
                    </p>

                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      Pay when your order is delivered.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-[var(--primary)] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </button>
              </form>
            </div>

            <aside className="h-fit rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-white p-6 shadow-[var(--shadow-sm)]">
              <h2 className="text-lg font-semibold text-[var(--dark)]">
                Order Summary
              </h2>

              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between gap-4 text-sm"
                  >
                    <div>
                      <p className="font-medium text-[var(--dark)]">
                        {item.product.name}
                      </p>

                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 font-medium text-[var(--dark)]">
                      Rs.{" "}
                      {(
                        item.product.price * item.quantity
                      ).toLocaleString("en-PK")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-[var(--border)] pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">
                    Total
                  </span>

                  <span className="text-xl font-bold text-[var(--navy)]">
                    Rs. {subtotal.toLocaleString("en-PK")}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs text-[var(--text-muted)]">
                Payment: Cash on Delivery
              </p>
            </aside>
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}