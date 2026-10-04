"use client";

import { useSyncExternalStore } from "react";

import {
  getProductPriceOverridesServerSnapshot,
  getProductPriceOverridesSnapshot,
  subscribeToProductPriceOverrides,
} from "@/lib/productPrices";

export function useProductPrice(
  productId: string,
  defaultPrice: number,
): number {
  const overrides = useSyncExternalStore(
    subscribeToProductPriceOverrides,
    getProductPriceOverridesSnapshot,
    getProductPriceOverridesServerSnapshot,
  );

  return overrides[productId] ?? defaultPrice;
}
