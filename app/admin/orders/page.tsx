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

const statusStyles: Record<Order["status"], string> = {
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
  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

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
    <div className="w-full min-w-0 max-w-full space-y-5 overflow-x-hidden sm:space-y-6">

      {/* Header */}
      <div className="flex min-w-0 items-start justify-between gap-3">

        <div className="min-w-0">
          <h1 className="text-[26px] font-bold text-[var(--dark)] sm:text-3xl">
            Orders
          </h1>

          <p className="mt-1 text-[13px] text-[var(--text-muted)] sm:text-sm">
            View and manage customer orders.
          </p>
        </div>

        {!loading && (
          <div className="shrink-0 rounded-lg border border-[var(--border-light)] bg-white px-2.5 py-1.5 text-[11px] text-[var(--text-muted)] sm:px-3.5 sm:py-2 sm:text-sm">
            {orders.length}{" "}
            {orders.length === 1 ? "order" : "orders"}
          </div>
        )}

      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-[var(--border-light)] bg-white px-4 py-16 text-center sm:py-20">

          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-[var(--primary)]" />

          <p className="mt-3 text-sm text-[var(--text-muted)]">
            Loading orders...
          </p>

        </div>
      )}

      {/* Empty */}
      {!loading && orders.length === 0 && (
        <div className="rounded-xl border border-[var(--border-light)] bg-white px-5 py-16 text-center sm:px-6 sm:py-20">

          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[var(--background-soft)]">
            <Package className="h-5 w-5 text-[var(--text-muted)]" />
          </div>

          <h2 className="mt-4 text-base font-medium text-[var(--dark)]">
            No orders yet
          </h2>

          <p className="mx-auto mt-1 max-w-sm text-sm text-[var(--text-muted)]">
            Customer orders will appear here when they are placed.
          </p>

        </div>
      )}

      {/* Orders */}
      {!loading && orders.length > 0 && (
        <div className="w-full min-w-0 space-y-4">

          {orders.map((order) => (
            <div
              key={order.id}
              className="w-full min-w-0 overflow-hidden rounded-xl border border-[var(--border-light)] bg-white"
            >

              {/* Order Header */}
              <div className="border-b border-[var(--border-light)] px-4 py-4 sm:px-5">

                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  {/* Order ID */}
                  <div className="min-w-0">

                    <div className="flex min-w-0 items-center gap-2">

                      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-[var(--primary)] sm:text-xs">
                        Order
                      </span>

                      <span className="min-w-0 truncate font-mono text-[12px] font-medium text-[var(--dark)] sm:text-sm">
                        #{order.id}
                      </span>

                    </div>

                    <p className="mt-1 text-[10px] text-[var(--text-muted)] sm:text-xs">
                      {formatDate(order.createdAt)}
                    </p>

                  </div>

                  {/* Status */}
                  <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto sm:shrink-0 sm:gap-3">

                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium capitalize sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-xs ${
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
                      className="h-8 min-w-0 flex-1 rounded-lg border border-[var(--border-light)] bg-white px-2 text-[11px] text-[var(--dark)] outline-none focus:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50 sm:h-9 sm:w-auto sm:flex-none sm:px-3 sm:text-sm"
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

              </div>

              {/* Order Body */}
              <div className="grid min-w-0 lg:grid-cols-[1fr_1.2fr]">

                {/* Customer */}
                <div className="min-w-0 border-b border-[var(--border-light)] p-4 lg:border-b-0 lg:border-r sm:p-5">

                  <p className="mb-4 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)] sm:text-xs">
                    Customer
                  </p>

                  <div className="space-y-4">

                    {/* Name */}
                    <div className="flex min-w-0 gap-3">

                      <User className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)]" />

                      <div className="min-w-0">
                        <p className="text-[10px] text-[var(--text-muted)] sm:text-xs">
                          Name
                        </p>

                        <p className="mt-0.5 truncate text-[13px] font-medium text-[var(--dark)] sm:text-sm">
                          {order.customer.name}
                        </p>
                      </div>

                    </div>

                    {/* Phone */}
                    <div className="flex min-w-0 gap-3">

                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)]" />

                      <div className="min-w-0">
                        <p className="text-[10px] text-[var(--text-muted)] sm:text-xs">
                          Phone
                        </p>

                        <p className="mt-0.5 truncate text-[13px] font-medium text-[var(--dark)] sm:text-sm">
                          {order.customer.phone}
                        </p>
                      </div>

                    </div>

                    {/* Address */}
                    <div className="flex min-w-0 gap-3">

                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-muted)]" />

                      <div className="min-w-0">
                        <p className="text-[10px] text-[var(--text-muted)] sm:text-xs">
                          Delivery Address
                        </p>

                        <p className="mt-0.5 break-words text-[13px] font-medium leading-5 text-[var(--dark)] sm:text-sm">
                          {order.customer.address}
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

                {/* Items */}
                <div className="min-w-0 p-4 sm:p-5">

                  <p className="mb-4 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)] sm:text-xs">
                    Order Items
                  </p>

                  <div className="min-w-0 space-y-2.5">

                    {order.items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex min-w-0 items-center justify-between gap-3 rounded-lg bg-[var(--background-soft)] px-3 py-3 sm:px-4"
                      >

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12px] font-medium text-[var(--dark)] sm:text-sm">
                            {item.name}
                          </p>

                          <p className="mt-0.5 text-[10px] text-[var(--text-muted)] sm:text-xs">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        <p className="shrink-0 text-[12px] font-semibold text-[var(--dark)] sm:text-sm">
                          Rs.{" "}
                          {(
                            item.price * item.quantity
                          ).toLocaleString("en-PK")}
                        </p>

                      </div>
                    ))}

                  </div>

                  {/* Total */}
                  <div className="mt-4 flex items-end justify-between gap-4 border-t border-[var(--border-light)] pt-4 sm:mt-5">

                    <div className="min-w-0">
                      <p className="text-[10px] text-[var(--text-muted)] sm:text-xs">
                        Payment
                      </p>

                      <p className="mt-1 text-[12px] font-medium text-[var(--dark)] sm:text-sm">
                        Cash on Delivery
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[10px] text-[var(--text-muted)] sm:text-xs">
                        Total
                      </p>

                      <p className="mt-1 text-base font-bold text-[var(--navy)] sm:text-lg">
                        Rs.{" "}
                        {order.subtotal.toLocaleString("en-PK")}
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