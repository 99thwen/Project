"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import type { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  cartMessage: string | null;
}

const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [items, setItems] = useState<CartItem[]>([]);
  const [cartMessage, setCartMessage] = useState<string | null>(
    null,
  );
  const [isHydrated, setIsHydrated] = useState(false);

  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // Load saved cart once when the app starts.
  useEffect(() => {
    const savedCart = localStorage.getItem("jaji-cart");

    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem("jaji-cart");
      }
    }

    setIsHydrated(true);
  }, []);

  // Save cart only after the saved cart has been loaded.
  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    localStorage.setItem("jaji-cart", JSON.stringify(items));
  }, [items, isHydrated]);

  useEffect(() => {
    return () => {
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
    };
  }, []);

  function addToCart(product: Product) {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          product,
          quantity: 1,
        },
      ];
    });

    setCartMessage(`${product.name} added to cart`);

    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
    }

    messageTimerRef.current = setTimeout(() => {
      setCartMessage(null);
    }, 2500);

    // Open cart after adding.
    if (pathname !== "/cart") {
      router.push("/cart");
    }
  }

  function removeFromCart(productId: string) {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.product.id !== productId,
      ),
    );
  }

  function updateQuantity(
    productId: string,
    quantity: number,
  ) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity }
          : item,
      ),
    );
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const subtotal = items.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        cartMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider",
    );
  }

  return context;
}