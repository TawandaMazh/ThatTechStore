import type { CartItem } from "@/types";
import { readCart, writeCart } from "@/lib/cart/storage";

type Listener = () => void;

let memory: CartItem[] | null = null;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

export function getCartSnapshot(): CartItem[] {
  if (typeof window === "undefined") return [];
  if (memory == null) memory = readCart();
  return memory;
}

export function getServerCartSnapshot(): CartItem[] {
  return [];
}

export function subscribeCart(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setCartItems(next: CartItem[]) {
  memory = next;
  writeCart(next);
  emit();
}
