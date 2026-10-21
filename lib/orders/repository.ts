import { createClient } from "@/lib/supabase/server";
import { mapOrderFromRpc } from "@/lib/orders/mappers";
import {
  confirmMockPayment,
  createMockOrder,
  getMockOrderByNumber,
  trackMockOrder,
  type CreateOrderInput,
} from "@/lib/orders/mock-store";
import type { Order, PaymentStatus } from "@/types";

export type { CreateOrderInput };

export type CreateOrderResult = {
  order: Order;
  paymentRef: string;
  source: "supabase" | "mock";
};

async function trySupabase<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

export async function createOrder(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  const fromDb = await trySupabase(async () => {
    const supabase = await createClient();
    const payload = {
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      delivery_area: input.deliveryArea,
      address: input.address,
      payment_method: input.paymentMethod,
      notes: input.notes ?? "",
      subtotal_zmw: input.subtotalZmw,
      deposit_zmw: input.depositZmw,
      amount_due_zmw: input.amountDueZmw,
      items: input.items.map((i) => ({
        product_id: i.productId,
        product_name: i.productName,
        product_slug: i.productSlug,
        unit_price_zmw: i.unitPriceZmw,
        quantity: i.quantity,
        is_preorder: i.isPreorder,
        deposit_zmw: i.depositZmw ?? null,
      })),
    };

    const { data, error } = await supabase.rpc("create_guest_order", {
      payload,
    });
    if (error || !data) throw error ?? new Error("no data");

    const row = data as Record<string, unknown>;
    const orderNumber = String(row.order_number);
    const paymentRef = String(row.payment_ref);

    const { data: conf } = await supabase.rpc("get_order_confirmation", {
      p_order_number: orderNumber,
    });
    if (!conf) throw new Error("missing confirmation");

    return {
      order: mapOrderFromRpc(conf as Record<string, unknown>),
      paymentRef,
      source: "supabase" as const,
    };
  });

  if (fromDb) return fromDb;

  const { order, paymentRef } = createMockOrder(input);
  return { order, paymentRef, source: "mock" };
}

export async function getOrderConfirmation(
  orderNumber: string,
): Promise<Order | null> {
  const fromDb = await trySupabase(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_order_confirmation", {
      p_order_number: orderNumber,
    });
    if (error) throw error;
    if (!data) return null;
    return mapOrderFromRpc(data as Record<string, unknown>);
  });

  if (fromDb) return fromDb;
  return getMockOrderByNumber(orderNumber);
}

export async function trackOrder(
  orderNumber: string,
  phone: string,
): Promise<Order | null> {
  const fromDb = await trySupabase(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("track_order_by_phone", {
      p_order_number: orderNumber,
      p_phone: phone,
    });
    if (error) throw error;
    if (!data) return null;
    return mapOrderFromRpc(data as Record<string, unknown>);
  });

  if (fromDb) return fromDb;
  return trackMockOrder(orderNumber, phone);
}

export async function confirmPaymentFromWebhook(
  paymentRef: string,
  status: Extract<PaymentStatus, "succeeded" | "failed">,
  raw: Record<string, unknown>,
): Promise<{ order: Order; source: "supabase" | "mock" } | null> {
  if (status === "succeeded") {
    const fromDb = await trySupabase(async () => {
      const secret = process.env.MOCK_WEBHOOK_SECRET;
      if (!secret) throw new Error("missing secret");
      const supabase = await createClient();
      const { data, error } = await supabase.rpc("confirm_payment_webhook", {
        p_provider_ref: paymentRef,
        p_secret: secret,
        p_raw: raw,
      });
      if (error || !data) throw error ?? new Error("no data");
      const row = data as Record<string, unknown>;
      const orderNumber = String(row.order_number);
      const { data: conf } = await supabase.rpc("get_order_confirmation", {
        p_order_number: orderNumber,
      });
      if (!conf) throw new Error("missing order");
      return {
        order: mapOrderFromRpc(conf as Record<string, unknown>),
        source: "supabase" as const,
      };
    });
    if (fromDb) return fromDb;
  }

  const order = confirmMockPayment(paymentRef, status);
  if (!order) return null;
  return { order, source: "mock" };
}
