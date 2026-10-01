"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useCart } from "@/components/cart/CartContext";
import { brands } from "@/data/brands";
import type {
  Product,
  ProductColor,
  ProductVariant,
} from "@/types/product";

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

  const variants = product.variants ?? [];
  const colors = product.colors ?? [];

  const [selectedVariantIndex, setSelectedVariantIndex] =
    useState(0);

  const [selectedColorIndex, setSelectedColorIndex] =
    useState(0);

  const selectedVariant: ProductVariant | undefined =
    variants.length > 0
      ? variants[selectedVariantIndex]
      : undefined;

  const selectedColor: ProductColor | undefined =
    colors.length > 0
      ? colors[selectedColorIndex]
      : undefined;

  const currentPrice =
    selectedVariant?.price ?? product.price;

  const currentModel =
    selectedVariant?.model ?? product.model;

  const currentSpecifications =
    selectedVariant?.specifications ??
    product.specifications;

const galleryImages = Array.from(
  new Set(
    selectedColor?.images?.length
      ? selectedColor.images
      : [
          ...(product.images ?? []),
          ...(selectedVariant?.image
            ? [selectedVariant.image]
            : []),
          product.image,
        ],
  ),
);
const [selectedImage, setSelectedImage] = useState(
  selectedColor?.images?.[0] ??
    product.images?.[0] ??
    selectedVariant?.image ??
    product.image,
);
const [isImageVisible, setIsImageVisible] = useState(true);

useEffect(() => {
  setIsImageVisible(false);

  const frame = window.requestAnimationFrame(() => {
    setIsImageVisible(true);
  });

  return () => window.cancelAnimationFrame(frame);
}, [selectedImage]);

const [quantity, setQuantity] = useState(1);
const [added, setAdded] = useState(false);

useEffect(() => {
  setSelectedImage(
    selectedColor?.images?.[0] ??
      selectedVariant?.image ??
      product.images?.[0] ??
      product.image,
  );
}, [
  selectedColorIndex,
  selectedVariantIndex,
  selectedColor?.images,
  selectedVariant?.image,
  product.images,
  product.image,
]);
const currentImageIndex = Math.max(
  0,
  galleryImages.indexOf(selectedImage),
);

function showPreviousImage() {
  if (galleryImages.length <= 1) return;

  const previousIndex =
    currentImageIndex === 0
      ? galleryImages.length - 1
      : currentImageIndex - 1;

  setSelectedImage(galleryImages[previousIndex]);
}

function showNextImage() {
  if (galleryImages.length <= 1) return;

  const nextIndex =
    currentImageIndex === galleryImages.length - 1
      ? 0
      : currentImageIndex + 1;

  setSelectedImage(galleryImages[nextIndex]);
}

  function handleVariantChange(index: number) {
    setSelectedVariantIndex(index);
  }

  function handleColorChange(index: number) {
    setSelectedColorIndex(index);
  }

  function increaseQuantity() {
    setQuantity((current) => current + 1);
  }

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function handleAddToCart() {
    const productToAdd: Product = selectedVariant
      ? {
          ...product,
          price: selectedVariant.price,
          image:
            selectedColor?.images?.[0] ??
            selectedVariant.image ??
            product.image,
          model:
            selectedVariant.model ??
            product.model,
          specifications:
            selectedVariant.specifications ??
            product.specifications,
        }
      : {
          ...product,
          image:
            selectedColor?.images?.[0] ??
            product.image,
        };

    for (let i = 0; i < quantity; i += 1) {
      addToCart(productToAdd);
    }

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1500);
  }

  const specificationEntries =
    currentSpecifications &&
    Object.entries(currentSpecifications);

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
const quickDetails: Array<[string, string]> = [
  selectedVariant?.size
    ? ["Size", selectedVariant.size]
    : null,

  currentModel
    ? ["Model", currentModel]
    : null,

  selectedVariant?.sku
    ? ["SKU", selectedVariant.sku]
    : null,

  selectedVariant?.dimensions
    ? ["Dimensions", selectedVariant.dimensions]
    : null,
].filter((entry): entry is [string, string] => entry !== null);
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* MAIN PRODUCT */}
      <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-[var(--shadow-sm)] sm:rounded-2xl">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
       {/* PRODUCT GALLERY */}
<div className="border-b border-[var(--border-light)] lg:border-b-0 lg:border-r">
  <div className="group relative aspect-square overflow-hidden bg-[var(--background-soft)] sm:aspect-[1.05/1] lg:aspect-square">
    {/* Product image */}
    <div
      className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${
        isImageVisible
          ? "scale-100 opacity-100"
          : "scale-[0.985] opacity-0"
      }`}
    >
      <Image
        src={selectedImage}
        alt={product.name}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 62vw"
        className="object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-[1.035] sm:p-4 lg:p-6"
      />
    </div>

  
    {/* Image counter */}
    {galleryImages.length > 1 && (
      <span className="absolute bottom-3 right-3 z-10 rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-[10px] font-medium text-[var(--dark)] shadow-sm backdrop-blur-sm sm:bottom-4 sm:right-4 sm:px-3 sm:text-[11px]">
        {currentImageIndex + 1} / {galleryImages.length}
      </span>
    )}

    {/* Previous image */}
    {galleryImages.length > 1 && (
      <button
        type="button"
        onClick={showPreviousImage}
        aria-label="Previous product image"
        className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[var(--dark)] opacity-100 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white active:scale-95 lg:left-4 lg:opacity-0 lg:group-hover:opacity-100"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    )}

    {/* Next image */}
    {galleryImages.length > 1 && (
      <button
        type="button"
        onClick={showNextImage}
        aria-label="Next product image"
        className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[var(--dark)] opacity-100 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white active:scale-95 lg:right-4 lg:opacity-0 lg:group-hover:opacity-100"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    )}
  </div>

  {/* Gallery thumbnails */}
  {galleryImages.length > 1 && (
    <div className="flex gap-2.5 overflow-x-auto border-t border-[var(--border-light)] bg-white px-4 py-3.5 sm:gap-3 sm:px-4 sm:py-4">
      {galleryImages.map((image, index) => {
        const isSelected = selectedImage === image;

        return (
          <button
  key={`${image}-${index}`}
  type="button"
  onClick={() => setSelectedImage(image)}
  aria-label={`View product image ${index + 1}`}
  aria-current={isSelected ? "true" : undefined}
  className={`group/thumb relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border bg-white transition-all duration-300 ease-out sm:h-16 sm:w-16 lg:h-[68px] lg:w-[68px] ${
    isSelected
      ? "border-[var(--primary)] shadow-sm ring-2 ring-[var(--primary)]/10"
      : "border-[var(--border-light)] hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:shadow-sm"
  }`}
>
  <Image
    src={image}
    alt=""
    fill
    sizes="68px"
    className={`object-contain p-1.5 transition-transform duration-300 ${
      isSelected
        ? "scale-105"
        : "group-hover/thumb:scale-105"
    }`}
  />

  {isSelected && (
    <span className="absolute bottom-1.5 left-1/2 h-0.5 w-7 -translate-x-1/2 rounded-full bg-[var(--primary)]" />
  )}
</button>
        );
      })}
    </div>
  )}
</div>

         {/* PRODUCT INFORMATION */}
<div className="flex flex-col p-4 sm:p-6 lg:p-7 xl:p-8">
 
 {/* PRODUCT HEADER */}
<div>
  <div className="flex items-center justify-between gap-4">
    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--primary)] sm:text-[11px]">
      {brand?.name ?? product.brandId}
    </p>

    {currentModel && (
      <p className="text-[10px] font-medium text-[var(--text-muted)] sm:text-[11px]">
        {currentModel}
      </p>
    )}
  </div>

  <h1 className="!mt-2.5 !text-[24px] !font-semibold !leading-[1.18] !tracking-tight text-[var(--dark)] sm:!text-[28px] lg:!text-[30px]">
    {product.name}
  </h1>
</div>

<div className="mt-5 h-px bg-[var(--border-light)]" />

{/* PRODUCT OPTIONS */}
{(variants.length > 0 || colors.length > 0) && (
  <div className="mt-5">
  {/* SIZE */}
  {variants.length > 0 && (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">

            Size
          </p>

         
        </div>

        <span className="text-[11px] font-medium text-[var(--text-muted)]">
          {variants.length} options
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {variants.map((variant, index) => {
          const isSelected = selectedVariantIndex === index;

          return (
            <button
              key={`${variant.name}-${index}`}
              type="button"
              onClick={() => handleVariantChange(index)}
              className={`relative rounded-xl border px-3 py-3 text-left transition-all duration-300 ease-out active:scale-[0.98] ${
                isSelected
                  ? "border-[var(--primary)] bg-[var(--primary-light)] shadow-sm"
                  : "border-[var(--border)] bg-white hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`text-[13px] font-semibold ${
                    isSelected
                      ? "text-[var(--primary)]"
                      : "text-[var(--dark)]"
                  }`}
                >
                  {variant.name}
                </span>

                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    isSelected
                      ? "scale-100 bg-[var(--primary)] opacity-100"
                      : "scale-75 border border-[var(--border)] opacity-0"
                  }`}
                >
                  <Check className="h-2.5 w-2.5 text-white" />
                </span>
              </div>

              {variant.price > 0 && (
                <p
                  className={`mt-1.5 text-[10px] font-medium ${
                    isSelected
                      ? "text-[var(--primary)]"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  Rs. {variant.price.toLocaleString("en-PK")}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  )}

  {/* COLOR */}
  {colors.length > 0 && (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--primary)]">
            Color
          </p>

         
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {colors.map((color, index) => {
          const isSelected = selectedColorIndex === index;

          return (
            <button
              key={`${color.name}-${index}`}
              type="button"
              onClick={() => handleColorChange(index)}
              className={`rounded-xl border px-3.5 py-2.5 transition-all duration-300 ease-out active:scale-[0.98] ${
                isSelected
                  ? "border-[var(--primary)] bg-[var(--primary-light)] shadow-sm"
                  : "border-[var(--border)] bg-white hover:-translate-y-0.5 hover:border-[var(--primary)]/40 hover:shadow-sm"
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    isSelected
                      ? "bg-[var(--primary)] ring-2 ring-[var(--primary)]/15"
                      : "bg-slate-200"
                  }`}
                />

                <span
                  className={`text-[12px] font-medium ${
                    isSelected
                      ? "text-[var(--primary)]"
                      : "text-[var(--dark)]"
                  }`}
                >
                  {color.name}
                </span>

                {isSelected && (
                  <Check className="h-3.5 w-3.5 text-[var(--primary)]" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  )}
  </div>
)}
{/* PRODUCT DETAILS */}
{quickDetails.length > 0 && (
  <div className="mt-5 overflow-hidden rounded-xl border border-[var(--border-light)]">
    <div className="border-b border-[var(--border-light)] bg-[var(--background-soft)] px-3.5 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
        Product Details
      </p>
    </div>

    <div
      className={`grid ${
        quickDetails.length === 1
          ? "grid-cols-1"
          : "grid-cols-2"
      }`}
    >
      {quickDetails.map(([label, value], index) => {
        const isLeftColumn = index % 2 === 0;

        return (
          <div
            key={label}
            className={`px-3.5 py-3 ${
              index < quickDetails.length - (quickDetails.length % 2 || 1)
                ? "border-b border-[var(--border-light)]"
                : ""
            } ${
              quickDetails.length > 1 && isLeftColumn
                ? "border-r border-[var(--border-light)]"
                : ""
            }`}
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-[var(--text-muted)]">
              {label}
            </p>

            <p className="mt-1 text-[13px] font-semibold leading-5 text-[var(--dark)]">
              {value}
            </p>
          </div>
        );
      })}
    </div>
  </div>
)}
  {/* PRICE */}
<div className="mt-5 rounded-xl border border-[var(--border-light)] bg-[var(--background-soft)] px-4 py-3.5 sm:py-4">
      <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Price
        </p>

        {currentPrice > 0 ? (
          <p className="mt-1 text-[26px] font-semibold tracking-tight text-[var(--navy)] sm:text-[28px]">
            Rs. {currentPrice.toLocaleString("en-PK")}
          </p>
        ) : (
          <p className="mt-1 text-[21px] font-semibold tracking-tight text-[var(--navy)]">
            Price on request
          </p>
        )}

        {!selectedVariant && product.priceMax && (
          <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
            Up to Rs. {product.priceMax.toLocaleString("en-PK")}
          </p>
        )}
      </div>

      <div className="shrink-0 rounded-full border border-[var(--border-light)] bg-white px-2.5 py-1.5 text-[10px] font-medium text-[var(--text-muted)]">
        COD available
      </div>
    </div>
  </div>


  {/* PURCHASE */}
  <div className="mt-5 border-t border-[var(--border-light)] pt-5">
    <div className="flex items-center justify-between gap-3">
      <p className="text-[13px] font-medium text-[var(--dark)]">
        Quantity
      </p>

      <div className="flex h-10 items-center overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-sm">
        <button
          type="button"
          onClick={decreaseQuantity}
          aria-label="Decrease quantity"
          className="flex h-full w-10 items-center justify-center text-lg text-[var(--dark)] transition-all duration-200 hover:bg-[var(--background-soft)] active:scale-95"
        >
          −
        </button>

        <span className="flex h-full min-w-11 items-center justify-center border-x border-[var(--border)] text-sm font-semibold text-[var(--dark)]">
          {quantity}
        </span>

        <button
          type="button"
          onClick={increaseQuantity}
          aria-label="Increase quantity"
          className="flex h-full w-10 items-center justify-center text-lg text-[var(--dark)] transition-all duration-200 hover:bg-[var(--background-soft)] active:scale-95"
        >
          +
        </button>
      </div>
    </div>

    <button
      type="button"
      onClick={handleAddToCart}
      className={`mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-[13px] font-semibold text-white shadow-sm transition-all duration-300 active:scale-[0.985] sm:text-sm ${
        added
          ? "bg-emerald-600 shadow-md shadow-emerald-600/15"
          : "bg-[var(--primary)] hover:-translate-y-0.5 hover:bg-[var(--primary-hover)] hover:shadow-lg"
      }`}
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

    <Link
      href="/shop"
      className="mt-3 inline-flex items-center text-[12px] font-medium text-[var(--text-muted)] transition-all duration-200 hover:translate-x-0.5 hover:text-[var(--primary)] sm:text-[13px]"
    >
      ← Continue Shopping
    </Link>
  </div>
</div>



      </div>
      </section>

      {/* DESCRIPTION */}
      {product.description && (
        <section className="rounded-xl border border-[var(--border)] bg-white px-4 py-4 sm:px-7 sm:py-5">
          <h2 className="!text-lg !font-semibold !leading-6 text-[var(--dark)]">
            Product Description
          </h2>

          <div className="mt-2 h-px bg-[var(--border-light)]" />

          <p className="mt-3 text-[14px] leading-6 text-[var(--text)] sm:text-[15px] sm:leading-7">
            {product.description}
          </p>
        </section>
      )}

      {/* HIGHLIGHTS */}
      {highlights.length > 0 && (
        <section className="rounded-xl border border-[var(--border)] bg-white px-4 py-4 sm:px-7 sm:py-5">
          <h2 className="!text-lg !font-semibold !leading-6 text-[var(--dark)]">
            Product Highlights
          </h2>

          <p className="mt-1 text-[13px] text-[var(--text-muted)] sm:text-sm">
            Key features of this product
          </p>

          <div className="mt-3 h-px bg-[var(--border-light)]" />

          <ul
            className={`mt-3 grid gap-x-8 gap-y-2 ${
              highlights.length > 1
                ? "sm:grid-cols-2"
                : ""
            }`}
          >
            {highlights.map((feature, index) => (
              <li
                key={`${feature}-${index}`}
                className="flex items-center gap-2.5 py-1"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                  <Check className="h-3 w-3" />
                </span>

                <span className="text-[13px] text-[var(--text)] sm:text-sm">
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
          <section className="rounded-xl border border-[var(--border)] bg-white px-4 py-4 sm:px-7 sm:py-5">
            <h2 className="!text-lg !font-semibold !leading-6 text-[var(--dark)]">
              Product Specifications
            </h2>

            <p className="mt-1 text-[13px] text-[var(--text-muted)] sm:text-sm">
              Product details and specifications
            </p>

            <div className="mt-3 overflow-hidden rounded-lg border border-[var(--border-light)]">
              {specificationEntries.map(
                ([label, value], index) => (
                  <div
                    key={label}
                    className={`grid grid-cols-1 gap-1 px-3.5 py-2.5 sm:grid-cols-2 sm:gap-4 sm:px-4 ${
                      index % 2 === 0
                        ? "bg-[var(--background-soft)]"
                        : "bg-white"
                    }`}
                  >
                    <span className="text-[13px] font-medium text-[var(--text-muted)] sm:text-sm">
                      {label}
                    </span>

                    <span className="text-[13px] font-medium text-[var(--dark)] sm:text-sm">
                      {value}
                    </span>
                  </div>
                ),
              )}
            </div>
          </section>
        )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="rounded-xl border border-[var(--border)] bg-white px-4 py-4 sm:px-7 sm:py-5">
          <h2 className="!text-lg !font-semibold !leading-6 text-[var(--dark)]">
            Frequently Asked Questions
          </h2>

          <p className="mt-1 text-[13px] text-[var(--text-muted)] sm:text-sm">
            Common questions about this product and ordering.
          </p>

          <div className="mt-4 divide-y divide-[var(--border-light)] border-t border-[var(--border-light)]">
            {faqs.map((faq, index) => (
              <div
                key={`${faq.question}-${index}`}
                className="py-3.5 sm:py-4"
              >
                <p className="text-[13px] font-semibold text-[var(--dark)] sm:text-sm">
                  {faq.question}
                </p>

                <p className="mt-1.5 text-[13px] leading-5 text-[var(--text-muted)] sm:text-sm sm:leading-6">
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