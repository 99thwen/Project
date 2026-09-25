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

  /* =====================================================
     EMPTY CART
  ===================================================== */

  if (items.length === 0 && !orderId) {
    return (
      <StoreLayout>
        <main className="bg-[var(--background-soft)]">
          <div className="container-main py-10 sm:py-16">
            <div className="mx-auto max-w-2xl rounded-xl border border-[var(--border)] bg-white px-5 py-12 text-center shadow-[var(--shadow-sm)] sm:rounded-[var(--radius-xl)] sm:px-6 sm:py-16">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary-light)] sm:h-16 sm:w-16">
                <ShoppingBag className="h-6 w-6 text-[var(--primary)] sm:h-7 sm:w-7" />
              </div>

              <h1 className="mt-5 !text-2xl !font-bold text-[var(--dark)] sm:mt-6 sm:!text-3xl">
                Your cart is empty
              </h1>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--text-muted)] sm:mt-3">
                Add a product to your cart before
                proceeding to checkout.
              </p>

              <Link
                href="/"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[var(--primary)] px-6 text-sm font-bold !text-white transition-colors hover:bg-[var(--primary-hover)] sm:mt-7"
              >
                Continue Shopping
              </Link>

            </div>
          </div>
        </main>
      </StoreLayout>
    );
  }

  /* =====================================================
     SUBMIT ORDER
  ===================================================== */

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
  /* =====================================================
     ORDER RECEIVED
  ===================================================== */

  if (orderId) {
    return (
      <StoreLayout>
        <main className="bg-[var(--background-soft)]">
          <div className="container-main py-8 sm:py-14">
            <div className="mx-auto max-w-2xl">

              {/* Success Card */}
              <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-sm)]">

                {/* Top Success Area */}
                <div className="px-5 pb-6 pt-8 text-center sm:px-8 sm:pb-8 sm:pt-10">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 sm:h-16 sm:w-16">
                    <Check className="h-7 w-7 sm:h-8 sm:w-8" />
                  </div>

                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--primary)] sm:mt-6 sm:text-xs">
                    Jaji Electronics
                  </p>

                  <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[var(--dark)] sm:text-3xl">
                    Order Received
                  </h1>

                  <p className="mx-auto mt-2.5 max-w-md text-sm leading-6 text-[var(--text-muted)] sm:mt-3">
                    Thank you for shopping with Jaji Electronics.
                    Your order has been received successfully.
                  </p>
                </div>

                {/* Order Details */}
                <div className="mx-4 rounded-xl border border-[var(--border-light)] bg-[var(--background-soft)] p-4 sm:mx-6 sm:p-5">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)] sm:text-xs">
                        Order ID
                      </p>

                      <p className="mt-1 break-all text-sm font-bold text-[var(--dark)] sm:text-base">
                        {orderId}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start rounded-lg bg-white px-3 py-2 sm:self-auto">
                      <Check className="h-4 w-4 text-green-600" />

                      <span className="text-xs font-semibold text-[var(--navy)] sm:text-sm">
                        Cash on Delivery
                      </span>
                    </div>

                  </div>
                </div>

                {/* What Happens Next */}
                <div className="px-5 py-6 sm:px-8 sm:py-7">

                  <h2 className="text-sm font-semibold text-[var(--dark)] sm:text-base">
                    What happens next?
                  </h2>

                  <div className="mt-4 space-y-3">

                    <div className="flex gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--primary-light)] text-xs font-bold text-[var(--primary)]">
                        1
                      </div>

                      <div>
                        <p className="text-sm font-medium text-[var(--dark)]">
                          Order confirmation
                        </p>

                        <p className="mt-0.5 text-xs leading-5 text-[var(--text-muted)]">
                          Our team will contact you to confirm your order.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--primary-light)] text-xs font-bold text-[var(--primary)]">
                        2
                      </div>

                      <div>
                        <p className="text-sm font-medium text-[var(--dark)]">
                          Delivery
                        </p>

                        <p className="mt-0.5 text-xs leading-5 text-[var(--text-muted)]">
                          Your order will be prepared and delivered to your provided address.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--primary-light)] text-xs font-bold text-[var(--primary)]">
                        3
                      </div>

                      <div>
                        <p className="text-sm font-medium text-[var(--dark)]">
                          Pay on delivery
                        </p>

                        <p className="mt-0.5 text-xs leading-5 text-[var(--text-muted)]">
                          Pay the order amount when your order arrives.
                        </p>
                      </div>
                    </div>

                  </div>

                  <Link
                    href="/"
                    className="mt-7 flex h-11 w-full items-center justify-center rounded-lg bg-[var(--primary)] px-6 text-sm font-bold !text-white transition-colors hover:bg-[var(--primary-hover)] sm:mt-8 sm:w-auto"
                  >
                    Continue Shopping
                  </Link>

                </div>

              </div>
            </div>
          </div>
        </main>
      </StoreLayout>
    );
  }
  /* =====================================================
     CHECKOUT
  ===================================================== */

  return (
    <StoreLayout>
      <main className="bg-[var(--background-soft)]">
        <div className="container-main py-7 sm:py-12">

          {/* Header */}
          <div className="mb-6 sm:mb-8">

            <Link
              href="/cart"
              className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--navy)] hover:text-[var(--primary)] sm:mb-5 sm:gap-2 sm:text-sm"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Back to Cart
            </Link>

            <p className="section-label">
              Checkout
            </p>

            <h1 className="section-title !text-2xl sm:!text-3xl lg:!text-4xl">
              Complete Your Order
            </h1>

            <p className="mt-1.5 text-[13px] leading-5 text-[var(--text-muted)] sm:mt-2 sm:text-sm">
              Enter your delivery details and place
              your order with Cash on Delivery.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="grid items-start gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_380px]"
          >

            {/* =================================================
                CUSTOMER INFORMATION
            ================================================= */}

            <div className="rounded-xl border border-[var(--border)] bg-white shadow-[var(--shadow-sm)] sm:rounded-[var(--radius-xl)]">

              {/* Card Header */}
              <div className="border-b border-[var(--border-light)] px-4 py-4 sm:px-8 sm:py-5">

                <h2 className="flex items-center gap-2 text-[15px] font-bold text-[var(--dark)] sm:text-lg">
                  <UserRound className="h-4 w-4 text-[var(--primary)] sm:h-5 sm:w-5" />
                  Delivery Information
                </h2>

                <p className="mt-0.5 text-[11px] text-[var(--text-muted)] sm:mt-1 sm:text-xs">
                  Please provide accurate information
                  for your order.
                </p>

              </div>

              {/* Form */}
              <div className="space-y-4 p-4 sm:space-y-5 sm:p-8">

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-[13px] font-semibold text-[var(--dark)] sm:mb-2 sm:text-sm"
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
                    className="h-11 w-full rounded-lg border border-[var(--border)] bg-white px-3.5 text-[13px] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 sm:h-12 sm:px-4 sm:text-sm"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-[13px] font-semibold text-[var(--dark)] sm:mb-2 sm:text-sm"
                  >
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)] sm:left-4" />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="03XX XXXXXXX"
                      className="h-11 w-full rounded-lg border border-[var(--border)] bg-white pl-10 pr-3.5 text-[13px] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 sm:h-12 sm:pl-11 sm:pr-4 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="mb-1.5 block text-[13px] font-semibold text-[var(--dark)] sm:mb-2 sm:text-sm"
                  >
                    Delivery Address
                  </label>

                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[var(--text-muted)] sm:left-4 sm:top-4" />

                    <textarea
                      id="address"
                      name="address"
                      required
                      rows={4}
                      autoComplete="street-address"
                      placeholder="Enter your complete delivery address"
                      className="w-full resize-y rounded-lg border border-[var(--border)] bg-white py-3 pl-10 pr-3.5 text-[13px] leading-5 outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 sm:pl-11 sm:pr-4 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Payment */}
                <div>
                  <p className="mb-1.5 text-[13px] font-semibold text-[var(--dark)] sm:mb-2 sm:text-sm">
                    Payment Method
                  </p>

                  <div className="flex items-start gap-2.5 rounded-lg border border-[var(--primary)] bg-[var(--primary-light)] p-3 sm:gap-3 sm:rounded-xl sm:p-4">

                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-white sm:h-8 sm:w-8">
                      <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>

                    <div>
                      <p className="text-[13px] font-bold text-[var(--dark)] sm:text-sm">
                        Cash on Delivery
                      </p>

                      <p className="mt-0.5 text-[11px] leading-5 text-[var(--text-muted)] sm:mt-1 sm:text-xs">
                        Pay when your order is delivered.
                      </p>
                    </div>

                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-lg bg-[var(--primary)] px-5 text-[13px] font-bold !text-white transition-all hover:bg-[var(--primary-hover)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:h-12 sm:text-sm"
                >
                  {isSubmitting
                    ? "Placing Order..."
                    : "Place Order"}
                </button>

                <p className="text-center text-[10px] leading-5 text-[var(--text-muted)] sm:text-xs">
                  By placing this order, you confirm
                  that your delivery information is
                  correct.
                </p>

              </div>
            </div>

            {/* =================================================
                ORDER SUMMARY
            ================================================= */}

            <aside className="rounded-xl border border-[var(--border)] bg-white shadow-[var(--shadow-sm)] sm:sticky sm:top-28 sm:rounded-[var(--radius-xl)]">

              <div className="border-b border-[var(--border-light)] px-4 py-4 sm:px-6 sm:py-5">

                <h2 className="flex items-center gap-2 text-[15px] font-bold text-[var(--dark)] sm:text-lg">
                  <ShoppingBag className="h-4 w-4 text-[var(--primary)] sm:h-5 sm:w-5" />
                  Order Summary
                </h2>

              </div>

              <div className="p-4 sm:p-6">

                <div className="space-y-3.5 sm:space-y-5">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3 sm:gap-4"
                    >

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-[13px] font-semibold leading-5 text-[var(--dark)] sm:text-sm">
                          {item.product.name}
                        </p>

                        <p className="mt-0.5 text-[11px] text-[var(--text-muted)] sm:mt-1 sm:text-xs">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="shrink-0 text-[13px] font-semibold text-[var(--dark)] sm:text-sm">
                        Rs.{" "}
                        {(
                          item.product.price *
                          item.quantity
                        ).toLocaleString("en-PK")}
                      </p>

                    </div>
                  ))}
                </div>

                <div className="my-4 h-px bg-[var(--border-light)] sm:my-6" />

                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[var(--text-muted)] sm:text-sm">
                    Subtotal
                  </span>

                  <span className="text-[13px] font-semibold text-[var(--dark)] sm:text-sm">
                    Rs.{" "}
                    {subtotal.toLocaleString("en-PK")}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 sm:mt-4">
                  <span className="text-[13px] text-[var(--text-muted)] sm:text-sm">
                    Payment
                  </span>

                  <span className="text-right text-[11px] font-semibold text-[var(--dark)] sm:text-sm">
                    Cash on Delivery
                  </span>
                </div>

                <div className="my-4 h-px bg-[var(--border-light)] sm:my-6" />

                <div className="flex items-center justify-between">

                  <span className="text-[15px] font-bold text-[var(--dark)] sm:text-base">
                    Total
                  </span>

                  <span className="text-xl font-bold text-[var(--navy)] sm:text-2xl">
                    Rs.{" "}
                    {subtotal.toLocaleString("en-PK")}
                  </span>

                </div>

                {/* COD info */}
                <div className="mt-4 rounded-lg bg-[var(--background-soft)] p-3 sm:mt-5 sm:p-4">

                  <p className="text-[11px] font-semibold text-[var(--dark)] sm:text-xs">
                    Cash on Delivery
                  </p>

                  <p className="mt-0.5 text-[11px] leading-5 text-[var(--text-muted)] sm:mt-1 sm:text-xs">
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