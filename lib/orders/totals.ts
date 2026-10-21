import type { CartItem } from "@/types";

export interface CartTotals {
  subtotalZmw: number;
  depositZmw: number;
  /** Amount charged now (deposits for preorders + full price for in-stock). */
  amountDueZmw: number;
  balanceLaterZmw: number;
  hasPreorder: boolean;
}

export function computeCartTotals(items: CartItem[]): CartTotals {
  let subtotalZmw = 0;
  let amountDueZmw = 0;
  let depositZmw = 0;
  let hasPreorder = false;

  for (const item of items) {
    const line = item.priceZmw * item.quantity;
    subtotalZmw += line;

    if (item.isPreorder) {
      hasPreorder = true;
      const perUnit =
        item.preorderDepositZmw != null && item.preorderDepositZmw > 0
          ? item.preorderDepositZmw
          : Math.round(item.priceZmw * 0.3);
      const lineDeposit = perUnit * item.quantity;
      depositZmw += lineDeposit;
      amountDueZmw += lineDeposit;
    } else {
      amountDueZmw += line;
    }
  }

  return {
    subtotalZmw,
    depositZmw,
    amountDueZmw,
    balanceLaterZmw: Math.max(0, subtotalZmw - amountDueZmw),
    hasPreorder,
  };
}
