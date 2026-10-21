import type {
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentRecord,
  PaymentStatus,
} from "@/types";

/**
 * Process-local order store used when Phase 3 Supabase RPCs are unavailable
 * (migration not applied / no app_config secret). Survives HMR via globalThis.
 */

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  deliveryArea: string;
  address: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  items: Array<{
    productId: string;
    productName: string;
    productSlug: string;
    unitPriceZmw: number;
    quantity: number;
    isPreorder: boolean;
    depositZmw?: number | null;
  }>;
  subtotalZmw: number;
  depositZmw: number;
  amountDueZmw: number;
}

type Store = {
  orders: Map<string, Order>;
  byPaymentRef: Map<string, string>;
};

const globalKey = "__thattechstore_orders__";

function getStore(): Store {
  const g = globalThis as typeof globalThis & { [globalKey]?: Store };
  if (!g[globalKey]) {
    g[globalKey] = {
      orders: new Map(),
      byPaymentRef: new Map(),
    };
  }
  return g[globalKey]!;
}

function randomSuffix(len = 6) {
  return Math.random()
    .toString(36)
    .slice(2, 2 + len)
    .toUpperCase();
}

function generateOrderNumber() {
  const d = new Date();
  const y = String(d.getFullYear()).slice(2);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `TTS-${y}${m}${day}-${randomSuffix()}`;
}

function normalizePhone(phone: string) {
  return phone.replace(/\s+/g, "");
}

export function createMockOrder(input: CreateOrderInput): {
  order: Order;
  paymentRef: string;
} {
  const store = getStore();
  const orderNumber = generateOrderNumber();
  const paymentRef = `mock_${crypto.randomUUID().replace(/-/g, "")}`;
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const items: OrderItem[] = input.items.map((item) => ({
    id: crypto.randomUUID(),
    productId: item.productId,
    productName: item.productName,
    productSlug: item.productSlug,
    unitPriceZmw: item.unitPriceZmw,
    quantity: item.quantity,
    isPreorder: item.isPreorder,
    depositZmw: item.depositZmw ?? null,
  }));

  const payment: PaymentRecord = {
    id: crypto.randomUUID(),
    provider: "mock",
    method: input.paymentMethod,
    amountZmw: input.amountDueZmw,
    status: "pending",
    providerRef: paymentRef,
  };

  const order: Order = {
    id,
    orderNumber,
    customerName: input.customerName.trim(),
    customerPhone: normalizePhone(input.customerPhone),
    deliveryArea: input.deliveryArea.trim(),
    address: input.address.trim(),
    status: "pending",
    paymentMethod: input.paymentMethod,
    subtotalZmw: input.subtotalZmw,
    depositZmw: input.depositZmw,
    amountDueZmw: input.amountDueZmw,
    notes: input.notes?.trim() || null,
    paidAt: null,
    outForDeliveryAt: null,
    deliveredAt: null,
    createdAt: now,
    items,
    payment,
  };

  store.orders.set(orderNumber.toUpperCase(), order);
  store.byPaymentRef.set(paymentRef, orderNumber.toUpperCase());
  return { order, paymentRef };
}

export function getMockOrderByNumber(orderNumber: string): Order | null {
  const store = getStore();
  return store.orders.get(orderNumber.trim().toUpperCase()) ?? null;
}

export function trackMockOrder(
  orderNumber: string,
  phone: string,
): Order | null {
  const order = getMockOrderByNumber(orderNumber);
  if (!order) return null;
  if (normalizePhone(order.customerPhone) !== normalizePhone(phone)) {
    return null;
  }
  return order;
}

export function confirmMockPayment(
  paymentRef: string,
  status: Extract<PaymentStatus, "succeeded" | "failed">,
): Order | null {
  const store = getStore();
  const key = store.byPaymentRef.get(paymentRef);
  if (!key) return null;
  const order = store.orders.get(key);
  if (!order || !order.payment) return null;

  if (status === "succeeded") {
    if (order.payment.status === "succeeded" && order.status === "paid") {
      return order;
    }
    const next: Order = {
      ...order,
      status: "paid",
      paidAt: order.paidAt ?? new Date().toISOString(),
      payment: { ...order.payment, status: "succeeded" },
    };
    store.orders.set(key, next);
    return next;
  }

  const failed: Order = {
    ...order,
    payment: { ...order.payment, status: "failed" },
  };
  store.orders.set(key, failed);
  return failed;
}

/** Dev helper: advance status for demos (not exposed to client as “paid”). */
export function setMockOrderStatus(
  orderNumber: string,
  status: OrderStatus,
): Order | null {
  const store = getStore();
  const key = orderNumber.trim().toUpperCase();
  const order = store.orders.get(key);
  if (!order) return null;
  const now = new Date().toISOString();
  const next: Order = {
    ...order,
    status,
    paidAt:
      status === "paid" ||
      status === "out_for_delivery" ||
      status === "delivered"
        ? (order.paidAt ?? now)
        : order.paidAt,
    outForDeliveryAt:
      status === "out_for_delivery" || status === "delivered"
        ? (order.outForDeliveryAt ?? now)
        : order.outForDeliveryAt,
    deliveredAt: status === "delivered" ? (order.deliveredAt ?? now) : order.deliveredAt,
  };
  store.orders.set(key, next);
  return next;
}
