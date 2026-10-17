
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { products as localProducts } from "@/data/products";
import type { Product } from "@/types/product";

const catalogCollection = collection(db, "productCatalog");

type CatalogDocument = Partial<Product> & {
  deleted?: boolean;
};

export async function getProducts(): Promise<Product[]> {
  try {
    const snapshot = await getDocs(catalogCollection);

    const overrides = new Map<string, CatalogDocument>();

    snapshot.forEach((item) => {
      overrides.set(item.id, item.data() as CatalogDocument);
    });

    const merged = new Map<string, Product>();

    // Start with all existing static products.
    for (const product of localProducts) {
      merged.set(product.id, product);
    }

    // Apply Firestore edits and additions.
    for (const [id, record] of overrides) {
      if (record.deleted) {
        merged.delete(id);
        continue;
      }

      const existing = merged.get(id);

      // Ignore incomplete records rather than breaking the catalogue.
      if (
        !record.name ||
        !record.slug ||
        !record.categoryId ||
        !record.brandId ||
        typeof record.price !== "number" ||
        !record.image
      ) {
        continue;
      }

      merged.set(id, {
        ...(existing ?? {}),
        ...record,
        id,
      } as Product);
    }

    return Array.from(merged.values());
  } catch (error) {
    console.error("Could not load Firestore product catalogue:", error);

    // Preserve the existing storefront if Firestore is unavailable.
    return localProducts;
  }
}

export async function saveCatalogProduct(
  product: Product,
): Promise<void> {
  if (
    !product.id.trim() ||
    !product.name.trim() ||
    !product.slug.trim() ||
    !product.categoryId.trim() ||
    !product.brandId.trim() ||
    !product.image.trim() ||
    !Number.isFinite(product.price) ||
    product.price < 0
  ) {
    throw new Error("Please provide all required product fields.");
  }

  await setDoc(doc(db, "productCatalog", product.id), {
    ...product,
    deleted: false,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCatalogProduct(
  productId: string,
): Promise<void> {
  if (!productId.trim()) {
    throw new Error("A product ID is required.");
  }

  // A tombstone hides a static product without deleting its source file.
  await setDoc(doc(db, "productCatalog", productId), {
    id: productId,
    deleted: true,
    updatedAt: serverTimestamp(),
  });
}
