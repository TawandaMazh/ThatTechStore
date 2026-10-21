"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  useTransition,
} from "react";
import type { CartItem, Product } from "@/types";
import {
  getCartSnapshot,
  getServerCartSnapshot,
  setCartItems,
  subscribeCart,
} from "@/lib/cart/store";
import { syncCartToSupabase } from "@/lib/cart/sync";

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotalZmw: number;
  ready: boolean;
  addItem: (product: Product, qty?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function subscribeHydration() {
  return () => {};
}

function getClientReady() {
  return true;
}

function getServerReady() {
  return false;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );
  const ready = useSyncExternalStore(
    subscribeHydration,
    getClientReady,
    getServerReady,
  );
  const [, startTransition] = useTransition();

  const persist = useCallback(
    (next: CartItem[]) => {
      setCartItems(next);
      startTransition(() => {
        void syncCartToSupabase(next);
      });
    },
    [],
  );

  const addItem = useCallback(
    (product: Product, qty = 1) => {
      const quantity = Math.max(1, qty);
      const prev = getCartSnapshot();
      const existing = prev.find((i) => i.productId === product.id);
      const next = existing
        ? prev.map((i) =>
            i.productId === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          )
        : [
            ...prev,
            {
              productId: product.id,
              slug: product.slug,
              name: product.name,
              priceZmw: product.priceZmw,
              image: product.images?.[0],
              quantity,
              isPreorder: Boolean(product.isPreorder),
              preorderDepositZmw: product.preorderDepositZmw ?? null,
            },
          ];
      persist(next);
    },
    [persist],
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      const prev = getCartSnapshot();
      const next =
        quantity <= 0
          ? prev.filter((i) => i.productId !== productId)
          : prev.map((i) =>
              i.productId === productId ? { ...i, quantity } : i,
            );
      persist(next);
    },
    [persist],
  );

  const removeItem = useCallback(
    (productId: string) => {
      persist(getCartSnapshot().filter((i) => i.productId !== productId));
    },
    [persist],
  );

  const clear = useCallback(() => persist([]), [persist]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotalZmw = items.reduce(
      (sum, i) => sum + i.priceZmw * i.quantity,
      0,
    );
    return {
      items,
      count,
      subtotalZmw,
      ready,
      addItem,
      setQuantity,
      removeItem,
      clear,
    };
  }, [items, ready, addItem, setQuantity, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
