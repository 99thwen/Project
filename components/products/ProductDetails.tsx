"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useState } from "react";

import { useCart } from "@/components/cart/CartContext";
import { brands } from "@/data/brands";
import type { Product } from "@/types/product";

interface ProductDetailsProps {
  product: Product;
}

const generalFaqs = [
  {
    question: "Do you offer Cash on Delivery?",
    answer:
      "Yes. Cash on Delivery is available for orders placed through Jaji Electronics.",
  },
  {
    question: "How can I place an order?",
    answer:
      "Select your product, add it to your cart, and complete checkout with your name, phone number, and delivery address.",
  },
  {
    question: "Do you offer online payment?",
    answer:
      "Currently, Jaji Electronics accepts Cash on Delivery only.",
  },
  {
    question: "Do you offer installment plans?",
    answer:
      "No. Currently, products are available on Cash on Delivery only.",
  },
  {
    question: "Do you deliver across Pakistan?",
    answer:
      "Delivery availability depends on the product and delivery location. Our team will confirm the delivery details with you.",
  },
  {
    question: "Are the products covered by warranty?",
    answer:
      "Warranty availability depends on the product and brand. Warranty information is displayed on the relevant product page where applicable.",
  },
  {
    question: "Can I contact Jaji Electronics before placing an order?",
    answer:
      "Yes. You can contact Jaji Electronics using the phone number or email provided on the website.",
  },
];

export default function ProductDetails({
  product,
}: ProductDetailsProps) {
  const { addToCart } = useCart();

  const brand = brands.find(
    (item) => item.id === product.brandId,
  );

  const galleryImages = Array.from(
    new Set([
      product.image,
      ...(product.images ?? []),
    ]),
  );

  const [selectedImage, setSelectedImage] =
    useState(product.image);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function increaseQuantity() {
    setQuantity((current) => current + 1);
  }

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function handleAddToCart() {
    for (let i = 0; i < quantity; i += 1) {
      addToCart(product);
    }

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1500);
  }

  const specificationEntries =
    product.specifications &&
    Object.entries(product.specifications);

  const highlights =
    product.features?.filter(
      (feature) => feature.trim().length > 0,
    ) ?? [];

  const productFaqs =
    product.faqs?.filter(
      (faq) =>
        faq.question.trim().length > 0 &&
        faq.answer.trim().length > 0,
    ) ?? [];

  const faqs =
    productFaqs.length > 0
      ? productFaqs
      : generalFaqs;

  return (
    <div className="space-y-5 sm:space-y-6">

      {/* MAIN PRODUCT */}
      <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-sm)]">
        <div className="grid lg:grid-cols-[1fr_0.9fr]">

          {/* PRODUCT GALLERY */}
          <div className="border-b border-[var(--border-light)] lg:border-b-0 lg:border-r">
            <div className="relative aspect-square bg-[var(--background-soft)]">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-contain p-5 sm:p-8"
              />

              <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-[var(--navy)] shadow-sm">
                Cash on Delivery
              </span>
            </div>

            {galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto border-t border-[var(--border-light)] p-3">
                {galleryImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    aria-label={`View product image ${index + 1}`}
                    className={`relative h-13 w-13 shrink-0 overflow-hidden rounded-lg border bg-[var(--background-soft)] transition-colors ${
                      selectedImage === image
                        ? "border-[var(--primary)]"
                        : "border-transparent hover:border-[var(--border)]"
                    }`}
                  >
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="52px"
                      className="object-contain p-1.5"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT INFORMATION */}
          <div className="flex flex-col p-6 sm:p-7 lg:p-8">

            {/* Brand */}
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">
              {brand?.name ?? product.brandId}
            </p>

            {/* Product Name */}
            <h1 className="!mt-2 !text-[28px] !font-semibold !leading-[1.2] !tracking-tight text-[var(--dark)] sm:!text-[32px]">
              {product.name}
            </h1>

            {/* Model */}
            {product.model && (
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Model:{" "}
                <span className="font-medium text-[var(--dark)]">
                  {product.model}
                </span>
              </p>
            )}

            <div className="my-4 h-px bg-[var(--border-light)]" />

            {/* PRICE */}
            <div>
              {product.price > 0 ? (
                <>
                  <p className="text-[25px] font-semibold tracking-tight text-[var(--navy)]">
                    Rs.{" "}
                    {product.price.toLocaleString("en-PK")}
                  </p>

                  {product.priceMax && (
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      Price up to Rs.{" "}
                      {product.priceMax.toLocaleString("en-PK")}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xl font-semibold text-[var(--navy)]">
                  Price on request
                </p>
              )}
            </div>

            {/* PURCHASE BENEFITS */}
            <div className="mt-4 space-y-2">

              <div className="flex items-center gap-3 rounded-lg bg-[var(--primary-light)] px-3.5 py-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                  <Check className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[var(--dark)]">
                    Cash on Delivery
                  </p>

                  <p className="text-xs text-[var(--text-muted)]">
                    Pay when your order is delivered.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-[var(--border-light)] px-3.5 py-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[var(--navy)]">
                  <Truck className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[var(--dark)]">
                    Delivery available
                  </p>

                  <p className="text-xs text-[var(--text-muted)]">
                    Delivery details confirmed at checkout.
                  </p>
                </div>
              </div>

            </div>

            {/* PURCHASE */}
            <div className="mt-5">

              <p className="mb-2 text-sm font-medium text-[var(--dark)]">
                Quantity
              </p>

              <div className="flex h-10 w-fit items-center overflow-hidden rounded-lg border border-[var(--border)]">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  aria-label="Decrease quantity"
                  className="flex h-full w-10 items-center justify-center text-lg text-[var(--dark)] transition-colors hover:bg-[var(--background-soft)]"
                >
                  −
                </button>

                <span className="flex h-full w-11 items-center justify-center border-x border-[var(--border)] text-sm font-medium text-[var(--dark)]">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  aria-label="Increase quantity"
                  className="flex h-full w-10 items-center justify-center text-lg text-[var(--dark)] transition-colors hover:bg-[var(--background-soft)]"
                >
                  +
                </button>

              </div>

             <button
  type="button"
  onClick={handleAddToCart}
  className="mt-3.5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--primary-hover)] hover:shadow-md active:scale-[0.98]"
>
                {added ? (
                  <>
                    <Check className="h-5 w-5" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>

            <Link
              href="/shop"
              className="mt-3 inline-flex text-sm font-medium text-[var(--navy)] transition-colors hover:text-[var(--primary)]"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      {product.description && (
        <section className="rounded-xl border border-[var(--border)] bg-white px-5 py-5 sm:px-7">
          <h2 className="!text-lg !font-semibold !leading-6 text-[var(--dark)]">
            Product Description
          </h2>

          <div className="mt-2 h-px bg-[var(--border-light)]" />

        <p className="mt-3 text-[15px] leading-7 text-[var(--text)]">
            {product.description}
          </p>
        </section>
      )}

      {/* HIGHLIGHTS */}
      {highlights.length > 0 && (
        <section className="rounded-xl border border-[var(--border)] bg-white px-5 py-5 sm:px-7">
          <h2 className="!text-lg !font-semibold !leading-6 text-[var(--dark)]">
            Product Highlights
          </h2>

          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Key features of this product
          </p>

          <div className="mt-3 h-px bg-[var(--border-light)]" />

          <ul
            className={`mt-3 grid gap-x-8 gap-y-2.5 ${
              highlights.length > 1
                ? "sm:grid-cols-2"
                : ""
            }`}
          >
            {highlights.map((feature, index) => (
              <li
                key={`${feature}-${index}`}
                className="flex items-center gap-2.5 py-1.5"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                  <Check className="h-3 w-3" />
                </span>

                <span className="text-sm text-[var(--text)]">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* SPECIFICATIONS */}
      {specificationEntries &&
        specificationEntries.length > 0 && (
          <section className="rounded-xl border border-[var(--border)] bg-white px-5 py-5 sm:px-7">
            <h2 className="!text-lg !font-semibold !leading-6 text-[var(--dark)]">
              Product Specifications
            </h2>

            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Product details and specifications
            </p>

            <div className="mt-3 overflow-hidden rounded-lg border border-[var(--border-light)]">
              {specificationEntries.map(
                ([label, value], index) => (
                  <div
                    key={label}
                    className={`grid grid-cols-1 gap-1 px-4 py-2.5 sm:grid-cols-2 sm:gap-4 ${
                      index % 2 === 0
                        ? "bg-[var(--background-soft)]"
                        : "bg-white"
                    }`}
                  >
                    <span className="text-sm font-medium text-[var(--text-muted)]">
                      {label}
                    </span>

                    <span className="text-sm font-medium text-[var(--dark)]">
                      {value}
                    </span>
                  </div>
                ),
              )}
            </div>
          </section>
        )}

      {/* FAQ */}
   {/* FAQ */}
{faqs.length > 0 && (
  <section className="rounded-xl border border-[var(--border)] bg-white px-5 py-5 sm:px-7">
    <h2 className="!text-lg !font-semibold !leading-6 text-[var(--dark)]">
      Frequently Asked Questions
    </h2>

    <p className="mt-1 text-sm text-[var(--text-muted)]">
      Common questions about this product and ordering.
    </p>

    <div className="mt-4 divide-y divide-[var(--border-light)] border-t border-[var(--border-light)]">
      {faqs.map((faq, index) => (
        <div
          key={`${faq.question}-${index}`}
          className="py-4"
        >
          <p className="text-sm font-semibold text-[var(--dark)]">
            {faq.question}
          </p>

          <p className="mt-1.5 text-sm leading-6 text-[var(--text-muted)]">
            {faq.answer}
          </p>
        </div>
      ))}
    </div>
  </section>
)}



    </div>
  );
}