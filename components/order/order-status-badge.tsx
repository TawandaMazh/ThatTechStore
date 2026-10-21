import type { OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

const LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  returned: "Returned",
};

const STYLES: Record<OrderStatus, string> = {
  pending: "bg-warning/15 text-warning",
  paid: "bg-success/15 text-success",
  out_for_delivery: "bg-accent-muted text-accent",
  delivered: "bg-success/20 text-success",
  returned: "bg-danger/15 text-danger",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        STYLES[status],
      )}
    >
      {LABELS[status]}
    </span>
  );
}
