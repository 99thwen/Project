"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Phone,
  Search,
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
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | Order["status"]
  >("all");

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
    status: Order["status"],
  ) {
    try {
      setUpdatingId(orderId);

      await updateOrderStatus(orderId, status);

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? { ...order, status }
            : order,
        ),
      );
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error,
      );

      alert("Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  }

  const counts = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(
        (order) => order.status === "pending",
      ).length,
      confirmed: orders.filter(
        (order) => order.status === "confirmed",
      ).length,
      delivered: orders.filter(
        (order) => order.status === "delivered",
      ).length,
      cancelled: orders.filter(
        (order) => order.status === "cancelled",
      ).length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" ||
        order.status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchableText = [
        order.id,
        order.customer.name,
        order.customer.phone,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [orders, search, statusFilter]);

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[26px] font-bold tracking-tight text-[var(--dark)] sm:text-3xl">
            Orders
          </h1>

          <p className="mt-1 text-[13px] text-[var(--text-muted)] sm:text-sm">
            View and manage customer orders.
          </p>
        </div>

        {!loading && (
          <div className="shrink-0 rounded-xl border border-[var(--border-light)] bg-white px-3 py-2 text-xs font-medium text-[var(--text-muted)] shadow-sm sm:px-4 sm:text-sm">
            {orders.length}{" "}
            {orders.length === 1 ? "order" : "orders"}
          </div>
        )}
      </div>

      {/* Summary */}
      {!loading && orders.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <SummaryCard
            label="Total"
            value={counts.total}
          />

          <SummaryCard
            label="Pending"
            value={counts.pending}
            valueClass="text-amber-600"
          />

          <SummaryCard
            label="Confirmed"
            value={counts.confirmed}
            valueClass="text-blue-600"
          />

          <SummaryCard
            label="Delivered"
            value={counts.delivered}
            valueClass="text-green-600"
          />

          <SummaryCard
            label="Cancelled"
            value={counts.cancelled}
            valueClass="text-red-600"
          />
        </div>
      )}

      {/* Search + Filter */}
      {!loading && orders.length > 0 && (
        <div className="rounded-xl border border-[var(--border-light)] bg-white p-3 shadow-sm sm:p-4">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by order ID, name or phone..."
                className="h-10 w-full rounded-lg border border-[var(--border-light)] bg-[var(--background-soft)] pl-10 pr-3 text-sm text-[var(--dark)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:bg-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | "all"
                    | Order["status"],
                )
              }
              className="h-10 w-full rounded-lg border border-[var(--border-light)] bg-[var(--background-soft)] px-3 text-sm text-[var(--dark)] outline-none focus:border-[var(--primary)] focus:bg-white sm:w-44"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-[var(--border-light)] bg-white px-4 py-20 text-center shadow-sm">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-[var(--primary)]" />

          <p className="mt-4 text-sm text-[var(--text-muted)]">
            Loading orders...
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading && orders.length === 0 && (
        <div className="rounded-2xl border border-[var(--border-light)] bg-white px-5 py-20 text-center shadow-sm sm:px-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background-soft)]">
            <Package className="h-5 w-5 text-[var(--text-muted)]" />
          </div>

          <h2 className="mt-4 text-base font-semibold text-[var(--dark)]">
            No orders yet
          </h2>

          <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-[var(--text-muted)]">
            Customer orders will appear here when they are placed.
          </p>
        </div>
      )}

      {/* No filtered results */}
      {!loading &&
        orders.length > 0 &&
        filteredOrders.length === 0 && (
          <div className="rounded-2xl border border-[var(--border-light)] bg-white px-5 py-16 text-center shadow-sm sm:px-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background-soft)]">
              <Search className="h-5 w-5 text-[var(--text-muted)]" />
            </div>

            <h2 className="mt-4 text-base font-semibold text-[var(--dark)]">
              No matching orders
            </h2>

            <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-[var(--text-muted)]">
              Try changing your search or status filter.
            </p>

            {(search || statusFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
                className="mt-4 text-sm font-semibold text-[var(--primary)] hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

      {/* Orders */}
      {!loading && filteredOrders.length > 0 && (
        <div className="w-full min-w-0 space-y-6">
          {filteredOrders.map((order) => (
            <article
              key={order.id}
              className="w-full min-w-0 overflow-hidden rounded-2xl border border-[var(--border-light)] bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Order Header */}
              <div className="border-b border-[var(--border-light)] px-5 py-5 sm:px-6 sm:py-5">
                <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] sm:text-xs">
                        Order
                      </span>

                      <span className="h-1 w-1 shrink-0 rounded-full bg-gray-300" />

                      <span className="min-w-0 truncate font-mono text-xs font-semibold text-[var(--dark)] sm:text-sm">
                        #{order.id}
                      </span>
                    </div>

                    <p className="mt-2 text-[11px] text-[var(--text-muted)] sm:text-xs">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex w-full items-center gap-2.5 sm:w-auto">
                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-semibold capitalize sm:px-3 sm:text-xs ${
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
                          event.target.value as Order["status"],
                        )
                      }
                      className="h-9 min-w-0 flex-1 rounded-lg border border-[var(--border-light)] bg-white px-3 text-xs font-medium text-[var(--dark)] outline-none focus:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-36 sm:flex-none sm:text-sm"
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

              {/* Main Content */}
              <div className="grid min-w-0 lg:grid-cols-[0.85fr_1.15fr]">
                {/* Customer */}
                <div className="min-w-0 border-b border-[var(--border-light)] p-5 sm:p-6 lg:border-b-0 lg:border-r">
                  <p className="mb-5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] sm:text-xs">
                    Customer
                  </p>

                  <div className="space-y-5">
                    {/* Name */}
                    <div className="flex min-w-0 gap-3.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--background-soft)]">
                        <User className="h-4 w-4 text-[var(--text-muted)]" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] text-[var(--text-muted)] sm:text-xs">
                          Name
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-[var(--dark)]">
                          {order.customer.name}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex min-w-0 gap-3.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--background-soft)]">
                        <Phone className="h-4 w-4 text-[var(--text-muted)]" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] text-[var(--text-muted)] sm:text-xs">
                          Phone
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-[var(--dark)]">
                          {order.customer.phone}
                        </p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex min-w-0 gap-3.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--background-soft)]">
                        <MapPin className="h-4 w-4 text-[var(--text-muted)]" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] text-[var(--text-muted)] sm:text-xs">
                          Delivery Address
                        </p>

                        <p className="mt-1 break-words text-sm font-medium leading-5 text-[var(--dark)]">
                          {order.customer.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="min-w-0 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] sm:text-xs">
                      Order Items
                    </p>

                    <span className="text-[10px] text-[var(--text-muted)] sm:text-xs">
                      {order.items.length}{" "}
                      {order.items.length === 1
                        ? "item"
                        : "items"}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex min-w-0 items-center justify-between gap-4 rounded-xl border border-[var(--border-light)] bg-[var(--background-soft)] px-4 py-3.5 sm:px-4 sm:py-4"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[var(--dark)] sm:text-[15px]">
                            {item.name}
                          </p>

                          <p className="mt-1 text-[11px] text-[var(--text-muted)] sm:text-xs">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-bold text-[var(--dark)] sm:text-[15px]">
                          Rs.{" "}
                          {(
                            item.price * item.quantity
                          ).toLocaleString("en-PK")}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="mt-5 flex items-end justify-between gap-4 border-t border-[var(--border-light)] pt-5">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)] sm:text-xs">
                        Payment
                      </p>

                      <p className="mt-1.5 text-sm font-semibold text-[var(--dark)]">
                        Cash on Delivery
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)] sm:text-xs">
                        Order Total
                      </p>

                      <p className="mt-1 text-lg font-bold text-[var(--navy)] sm:text-xl">
                        Rs.{" "}
                        {order.subtotal.toLocaleString("en-PK")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  valueClass = "text-[var(--dark)]",
}: {
  label: string;
  value: number;
  valueClass?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border-light)] bg-white px-4 py-4 shadow-sm sm:px-5 sm:py-4">
      <p className="text-[11px] font-medium text-[var(--text-muted)] sm:text-xs">
        {label}
      </p>

      <p
        className={`mt-1 text-xl font-bold sm:text-2xl ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}