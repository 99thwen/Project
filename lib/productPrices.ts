import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

const priceOverridesCollection = collection(
  db,
  "productOverrides",
);

export interface ProductPriceOverrides {
  [productId: string]: number;
}

let overrides: ProductPriceOverrides = {};
const serverSnapshot: ProductPriceOverrides = {};
let unsubscribe: Unsubscribe | null = null;
let initialized = false;

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function startPriceListener() {
  if (unsubscribe) return;

  unsubscribe = onSnapshot(
    priceOverridesCollection,
    (snapshot) => {
      const nextOverrides: ProductPriceOverrides = {};

      snapshot.forEach((document) => {
        const data = document.data();

        if (typeof data.price === "number") {
          nextOverrides[document.id] = data.price;
        }
      });

      overrides = nextOverrides;
      initialized = true;
      notifyListeners();
    },
    (error) => {
      console.error("Failed to load product price overrides:", error);
      initialized = true;
      notifyListeners();
    },
  );
}

export function subscribeToProductPriceOverrides(
  listener: () => void,
): () => void {
  listeners.add(listener);
  startPriceListener();

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0 && unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  };
}

export function getProductPriceOverridesSnapshot(): ProductPriceOverrides {
  return overrides;
}

export function getProductPriceOverridesServerSnapshot(): ProductPriceOverrides {
  return serverSnapshot;
}

export function getProductPrice(
  productId: string,
  defaultPrice: number,
): number {
  return overrides[productId] ?? defaultPrice;
}

export async function getProductPriceOverrides(): Promise<ProductPriceOverrides> {
  const snapshot = await getDocs(priceOverridesCollection);
  const nextOverrides: ProductPriceOverrides = {};

  snapshot.forEach((document) => {
    const data = document.data();

    if (typeof data.price === "number") {
      nextOverrides[document.id] = data.price;
    }
  });

  overrides = nextOverrides;
  initialized = true;
  notifyListeners();

  return nextOverrides;
}

export async function saveProductPrice(
  productId: string,
  price: number,
): Promise<void> {
  const productRef = doc(
    db,
    "productOverrides",
    productId,
  );

  await setDoc(productRef, {
    price,
  });
}

export function areProductPricesInitialized(): boolean {
  return initialized;
}
