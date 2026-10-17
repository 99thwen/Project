
import "server-only";

import { cache } from "react";
import { adminDb } from "@/lib/firebaseAdmin";
import { products as localProducts } from "@/data/products";
import type { Product } from "@/types/product";

const PRODUCT_FIELDS = [
  "name",
  "slug",
  "features",
  "faqs",
  "categoryId",
  "brandId",
  "price",
  "priceMax",
  "image",
  "images",
  "description",
  "specifications",
  "variants",
  "colors",
  "model",
] as const;

function isValidProduct(
  product: Record<string, unknown>,
): boolean {
  return (
    typeof product.name === "string" &&
    !!product.name.trim() &&
    typeof product.slug === "string" &&
    !!product.slug.trim() &&
    typeof product.categoryId === "string" &&
    !!product.categoryId.trim() &&
    typeof product.brandId === "string" &&
    !!product.brandId.trim() &&
    typeof product.price === "number" &&
    Number.isFinite(product.price) &&
    product.price >= 0 &&
    typeof product.image === "string" &&
    !!product.image.trim()
  );
}

export const getStoreProducts = cache(
  async (): Promise<Product[]> => {
    // Read saved product details and price overrides together.
    const [catalogSnapshot, overrideSnapshot] = await Promise.all([
      adminDb.collection("productCatalog").get(),
      adminDb.collection("productOverrides").get(),
    ]);

    const merged = new Map<string, Product>();
    const priceOverrides = new Map<string, number>();

    // Keep all existing static products.
    for (const product of localProducts) {
      merged.set(product.id, product);
    }

    // Apply saved product additions, edits and soft deletions.
    for (const document of catalogSnapshot.docs) {
      const record = document.data();

      if (record.deleted === true) {
        merged.delete(document.id);
        continue;
      }

      const savedFields: Record<string, unknown> = {};

      for (const field of PRODUCT_FIELDS) {
        if (record[field] !== undefined) {
          savedFields[field] = record[field];
        }
      }

      const existing = merged.get(document.id);

      const candidate = {
        ...(existing ?? {}),
        ...savedFields,
        id: document.id,
      } as Product;

      if (
        !isValidProduct(
          candidate as unknown as Record<string, unknown>,
        )
      ) {
        continue;
      }

      merged.set(document.id, candidate);
    }

    // Collect valid overrides without changing the override collection.
    for (const document of overrideSnapshot.docs) {
      const price = document.data().price;

      if (
        typeof price === "number" &&
        Number.isFinite(price) &&
        price >= 0
      ) {
        priceOverrides.set(document.id, price);
      }
    }

    // An explicit price override takes precedence over the base price.
    return Array.from(merged.values()).map((product) => {
      const overridePrice = priceOverrides.get(product.id);

      if (overridePrice === undefined) {
        return product;
      }

      return {
        ...product,
        price: overridePrice,
      };
    });
  },
);
