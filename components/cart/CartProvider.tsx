"use client";

import {
  CartProvider as CartContextProvider,
} from "@/components/cart/CartContext";

interface CartProviderProps {
  children: React.ReactNode;
}

export default function CartProvider({
  children,
}: CartProviderProps) {
  return (
    <CartContextProvider>
      {children}
    </CartContextProvider>
  );
}