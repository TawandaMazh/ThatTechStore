import Link from "next/link";
import type { Order } from "@/types";
import { OrderStatusBadge } from "@/components/order/order-status-badge";
import { PAYMENT_METHOD_LABELS } from "@/lib/payments";
import { formatZmw } from "@/lib/utils";

export function OrderSummary({ order }: { order: Order }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <OrderStatusBadge status={order.status} />
        <p className="text-sm text-text-muted">
          Order{" "}
          <span className="font-mono font-medium text-text">
            {order.orderNumber}
          </span>
        </p>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-text-muted">Customer</dt>
          <dd className="font-medium text-text">{order.customerName}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Phone</dt>
          <dd className="font-medium text-text">{order.customerPhone}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Area</dt>
          <dd className="font-medium text-text">{order.deliveryArea}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Payment</dt>
          <dd className="font-medium text-text">
            {PAYMENT_METHOD_LABELS[order.paymentMethod]}
            {order.payment?.status === "succeeded" ? " · confirmed" : ""}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-text-muted">Address</dt>
          <dd className="font-medium text-text">{order.address}</dd>
        </div>
      </dl>

      <ul className="divide-y divide-border rounded-[var(--radius-lg)] border border-border">
        {order.items.map((item) => (
          <li
            key={item.id}
            className="flex items-start justify-between gap-4 px-4 py-3 text-sm"
          >
            <div>
              <Link
                href={`/products/${item.productSlug}`}
                className="font-medium text-text hover:text-accent"
              >
                {item.productName}
              </Link>
              <p className="text-text-muted">
                ×{item.quantity}
                {item.isPreorder ? " · Pre-order" : ""}
              </p>
            </div>
            <p className="shrink-0 font-medium text-text">
              {formatZmw(item.unitPriceZmw * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-text-muted">Subtotal</dt>
          <dd className="text-text">{formatZmw(order.subtotalZmw)}</dd>
        </div>
        {order.depositZmw > 0 ? (
          <div className="flex justify-between">
            <dt className="text-text-muted">Deposit / paid now</dt>
            <dd className="text-text">{formatZmw(order.amountDueZmw)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between border-t border-border pt-2">
          <dt className="font-medium text-text">Amount due at checkout</dt>
          <dd className="font-display font-semibold text-text">
            {formatZmw(order.amountDueZmw)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
