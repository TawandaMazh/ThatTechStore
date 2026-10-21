import { NextResponse } from "next/server";
import { createOrder } from "@/lib/orders/repository";
import { computeCartTotals } from "@/lib/orders/totals";
import { getPaymentProvider } from "@/lib/payments";
import type { CartItem, PaymentMethod } from "@/types";

const METHODS: PaymentMethod[] = [
  "mtn_momo",
  "airtel",
  "zamtel",
  "card",
  "cod",
];

function siteUrl(request: Request) {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    new URL(request.url).origin
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const customerName = String(data.customerName ?? "").trim();
  const customerPhone = String(data.customerPhone ?? "").trim();
  const deliveryArea = String(data.deliveryArea ?? "").trim();
  const address = String(data.address ?? "").trim();
  const paymentMethod = data.paymentMethod as PaymentMethod;
  const notes = String(data.notes ?? "").trim();
  const items = Array.isArray(data.items) ? (data.items as CartItem[]) : [];

  if (!customerName || !customerPhone || !deliveryArea || !address) {
    return NextResponse.json(
      { error: "Name, phone, area, and address are required." },
      { status: 400 },
    );
  }
  if (!METHODS.includes(paymentMethod)) {
    return NextResponse.json(
      { error: "Invalid payment method." },
      { status: 400 },
    );
  }
  if (!items.length) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  const normalizedItems = items.map((item) => ({
    productId: String(item.productId),
    productName: String(item.name),
    productSlug: String(item.slug),
    unitPriceZmw: Number(item.priceZmw),
    quantity: Math.max(1, Number(item.quantity) || 1),
    isPreorder: Boolean(item.isPreorder),
    depositZmw: item.preorderDepositZmw ?? null,
  }));

  const cartLike: CartItem[] = items.map((item) => ({
    productId: String(item.productId),
    slug: String(item.slug),
    name: String(item.name),
    priceZmw: Number(item.priceZmw),
    quantity: Math.max(1, Number(item.quantity) || 1),
    isPreorder: Boolean(item.isPreorder),
    preorderDepositZmw: item.preorderDepositZmw ?? null,
  }));

  const totals = computeCartTotals(cartLike);

  const created = await createOrder({
    customerName,
    customerPhone,
    deliveryArea,
    address,
    paymentMethod,
    notes: notes || undefined,
    items: normalizedItems,
    subtotalZmw: totals.subtotalZmw,
    depositZmw: totals.depositZmw,
    amountDueZmw: totals.amountDueZmw,
  });

  const provider = getPaymentProvider();
  const initiation = await provider.initiate({
    orderNumber: created.order.orderNumber,
    paymentRef: created.paymentRef,
    amountZmw: totals.amountDueZmw,
    method: paymentMethod,
    customerName,
    customerPhone,
    siteUrl: siteUrl(request),
  });

  return NextResponse.json({
    ok: true,
    orderNumber: created.order.orderNumber,
    paymentRef: created.paymentRef,
    status: created.order.status,
    amountDueZmw: totals.amountDueZmw,
    source: created.source,
    payment: initiation,
  });
}
