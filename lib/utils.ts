import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatZmw(amount: number): string {
  return `K${amount.toLocaleString("en-ZM")}`;
}
