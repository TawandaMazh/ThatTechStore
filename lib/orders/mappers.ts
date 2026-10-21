import type {
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentRecord,
  PaymentStatus,
} from "@/types";

function num(v: unknown): number {
  return Number(v ?? 0);
}

export function mapOrderFromRpc(raw: Record<string, unknown>): Order {
  const itemsRaw = Array.isArray(raw.items) ? raw.items : [];
  const items: OrderItem[] = itemsRaw.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      id: String(row.id ?? crypto.randomUUID()),
      productId: row.product_id ? String(row.product_id) : null,
      productName: String(row.product_name ?? ""),
      productSlug: String(row.product_slug ?? ""),
      unitPriceZmw: num(row.unit_price_zmw),
      quantity: Number(row.quantity ?? 1),
      isPreorder: Boolean(row.is_preorder),
      depositZmw:
        row.deposit_zmw == null ? null : num(row.deposit_zmw),
    };
  });

  let payment: PaymentRecord | null = null;
  if (raw.payment && typeof raw.payment === "object") {
    const p = raw.payment as Record<string, unknown>;
    payment = {
      id: p.id ? String(p.id) : undefined,
      provider: String(p.provider ?? "mock"),
      method: p.method as PaymentMethod,
      amountZmw: num(p.amount_zmw),
      status: p.status as PaymentStatus,
      providerRef: String(p.provider_ref ?? ""),
    };
  }

  return {
    id: String(raw.id),
    orderNumber: String(raw.order_number),
    customerName: String(raw.customer_name),
    customerPhone: String(raw.customer_phone),
    deliveryArea: String(raw.delivery_area),
    address: String(raw.address),
    status: raw.status as OrderStatus,
    paymentMethod: raw.payment_method as PaymentMethod,
    subtotalZmw: num(raw.subtotal_zmw),
    depositZmw: num(raw.deposit_zmw),
    amountDueZmw: num(raw.amount_due_zmw),
    notes: (raw.notes as string | null) ?? null,
    paidAt: (raw.paid_at as string | null) ?? null,
    outForDeliveryAt: (raw.out_for_delivery_at as string | null) ?? null,
    deliveredAt: (raw.delivered_at as string | null) ?? null,
    createdAt: String(raw.created_at ?? new Date().toISOString()),
    items,
    payment,
  };
}
