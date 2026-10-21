import { NextResponse } from "next/server";
import { trackOrder } from "@/lib/orders/repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderNumber = (searchParams.get("orderNumber") ?? "").trim();
  const phone = (searchParams.get("phone") ?? "").trim();

  if (!orderNumber || !phone) {
    return NextResponse.json(
      { error: "orderNumber and phone are required" },
      { status: 400 },
    );
  }

  const order = await trackOrder(orderNumber, phone);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, order });
}
