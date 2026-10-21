import type { Order, OrderStatus } from "@/types";

export interface TimelineStep {
  key: OrderStatus;
  label: string;
  description: string;
  at: string | null;
  state: "done" | "current" | "upcoming";
}

const STEPS: Array<{
  key: OrderStatus;
  label: string;
  description: string;
}> = [
  {
    key: "pending",
    label: "Pending",
    description: "Order received — awaiting payment confirmation.",
  },
  {
    key: "paid",
    label: "Paid",
    description: "Payment confirmed (via provider webhook).",
  },
  {
    key: "out_for_delivery",
    label: "Out for delivery",
    description: "On the way across Lusaka.",
  },
  {
    key: "delivered",
    label: "Delivered",
    description: "Handed over to you.",
  },
];

const RANK: Record<OrderStatus, number> = {
  pending: 0,
  paid: 1,
  out_for_delivery: 2,
  delivered: 3,
  returned: -1,
};

export function buildOrderTimeline(order: Order): TimelineStep[] {
  if (order.status === "returned") {
    return [
      {
        key: "pending",
        label: "Returned",
        description: "This order was marked returned.",
        at: order.createdAt,
        state: "current",
      },
    ];
  }

  const current = RANK[order.status] ?? 0;

  return STEPS.map((step) => {
    const rank = RANK[step.key];
    let at: string | null = null;
    if (step.key === "pending") at = order.createdAt;
    if (step.key === "paid") at = order.paidAt ?? null;
    if (step.key === "out_for_delivery") at = order.outForDeliveryAt ?? null;
    if (step.key === "delivered") at = order.deliveredAt ?? null;

    let state: TimelineStep["state"] = "upcoming";
    if (rank < current) state = "done";
    else if (rank === current) state = "current";

    // COD: still "pending" until paid on delivery — paid step is upcoming
    return { ...step, at, state };
  });
}
