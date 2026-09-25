"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Phone,
  User,
  XCircle,
} from "lucide-react";

import {
  getOrders,
  updateOrderStatus,
} from "@/lib/orders";

import type { Order } from "@/types/order";

const statusStyles: Record<
  Order["status"],
  string
> = {
  pending:
    "bg-amber-50 text-amber-700 border-amber-200",
  confirmed:
    "bg-blue-50 text-blue-700 border-blue-200",
  delivered:
    "bg-green-50 text-green-700 border-green-200",
  cancelled:
    "bg-red-50 text-red-700 border-red-200",
};

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getStatusIcon(status: Order["status"]) {
  switch (status) {
    case "pending":
      return <Clock3 className="h-3.5 w-3.5" />;

    case "confirmed":
      return <CheckCircle2 className="h-3.5 w-3.5" />;

    case "delivered":
      return <CheckCircle2 className="h-3.5 w-3.5" />;

    case "cancelled":
      return <XCircle className="h-3.5 w-3.5" />;

    default:
      return null;
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  async function handleStatusChange(
    orderId: string,
    status: Order["status"]
  ) {
    try {
      setUpdatingId(orderId);

      await updateOrderStatus(orderId, status);

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? { ...order, status }
            : order
        )
      );
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error
      );

      alert("Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--dark)]">
            Orders
          </h1>

          <p className="mt-1 text-sm text-[var(--text-muted)]">
            View and manage customer orders.
          </p>
        </div>

        {!loading && (
          <div className="rounded-lg border border-[var(--border-light)] bg-white px-3.5 py-2 text-sm text-[var(--text-muted)]">
            {orders.length}{" "}
            {orders.length === 1 ? "order" : "orders"}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-[var(--border-light)] bg-white py-20 text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-[var(--primary)]" />

          <p className="mt-3 text-sm text-[var(--text-muted)]">
            Loading orders...
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading && orders.length === 0 && (
        <div className="rounded-xl border border-[var(--border-light)] bg-white px-6 py-20 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--background-soft)]">
            <Package className="h-5 w-5 text-[var(--text-muted)]" />
          </div>

          <h2 className="mt-4 text-base font-medium text-[var(--dark)]">
            No orders yet
          </h2>

          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Customer orders will appear here when they are placed.
          </p>
        </div>
      )}

      {/* Orders */}
      {!loading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-xl border border-[var(--border-light)] bg-white"
            >
              {/* Order Header */}
              <div className="flex flex-col gap-4 border-b border-[var(--border-light)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium uppercase tracking-wide text-[var(--primary)]">
                      Order
                    </span>

                    <span className="font-mono text-sm font-medium text-[var(--dark)]">
                      #{order.id}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${
                      statusStyles[order.status]
                    }`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>

                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(event) =>
                      handleStatusChange(
                        order.id,
                        event.target.value as Order["status"]
                      )
                    }
                    className="rounded-lg border border-[var(--border-light)] bg-white px-3 py-2 text-sm text-[var(--dark)] outline-none transition focus:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="pending">
                      Pending
                    </option>

                    <option value="confirmed">
                      Confirmed
                    </option>

                    <option value="delivered">
                      Delivered
                    </option>

                    <option value="cancelled">
                      Cancelled
                    </option>
                  </select>
                </div>
              </div>

              {/* Order Body */}
              <div className="grid lg:grid-cols-[1fr_1.2fr]">
                {/* Customer */}
                <div className="border-b border-[var(--border-light)] p-5 lg:border-b-0 lg:border-r">
                  <p className="mb-4 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                    Customer
                  </p>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <User className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)]" />

                      <div>
                        <p className="text-xs text-[var(--text-muted)]">
                          Name
                        </p>

                        <p className="mt-0.5 text-sm font-medium text-[var(--dark)]">
                          {order.customer.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)]" />

                      <div>
                        <p className="text-xs text-[var(--text-muted)]">
                          Phone
                        </p>

                        <p className="mt-0.5 text-sm font-medium text-[var(--dark)]">
                          {order.customer.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)]" />

                      <div>
                        <p className="text-xs text-[var(--text-muted)]">
                          Delivery Address
                        </p>

                        <p className="mt-0.5 text-sm font-medium leading-5 text-[var(--dark)]">
                          {order.customer.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="p-5">
                  <p className="mb-4 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                    Order Items
                  </p>

                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between gap-4 rounded-lg bg-[var(--background-soft)] px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[var(--dark)]">
                            {item.name}
                          </p>

                          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-medium text-[var(--dark)]">
                          Rs.{" "}
                          {(
                            item.price * item.quantity
                          ).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="mt-5 flex items-center justify-between border-t border-[var(--border-light)] pt-4">
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">
                        Payment
                      </p>

                      <p className="mt-1 text-sm font-medium text-[var(--dark)]">
                        Cash on Delivery
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-[var(--text-muted)]">
                        Total
                      </p>

                      <p className="mt-1 text-lg font-semibold text-[var(--dark)]">
                        Rs.{" "}
                        {order.subtotal.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}