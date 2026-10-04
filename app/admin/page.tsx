"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Package,
  ShoppingBag,
  TrendingUp,
  XCircle,
} from "lucide-react";

import { getOrders } from "@/lib/orders";
import type { Order } from "@/types/order";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load dashboard orders:", error);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  const stats = useMemo(() => {
    const totalSales = orders.reduce(
      (sum, order) => sum + order.subtotal,
      0,
    );

    return {
      totalOrders: orders.length,
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
      totalSales,
    };
  }, [orders]);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-[26px] font-bold tracking-tight text-[var(--dark)] sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-1 text-[13px] text-[var(--text-muted)] sm:text-sm">
          Overview of your Jaji Electronics store.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Orders"
          value={loading ? "—" : stats.totalOrders}
          icon={<ShoppingBag className="h-5 w-5" />}
        />

        <StatCard
          label="Pending"
          value={loading ? "—" : stats.pending}
          icon={<Clock3 className="h-5 w-5" />}
          valueClass="text-amber-600"
        />

        <StatCard
          label="Delivered"
          value={loading ? "—" : stats.delivered}
          icon={<CheckCircle2 className="h-5 w-5" />}
          valueClass="text-green-600"
        />

        <StatCard
          label="Cancelled"
          value={loading ? "—" : stats.cancelled}
          icon={<XCircle className="h-5 w-5" />}
          valueClass="text-red-600"
        />
      </div>

      {/* Sales Overview */}
      <section className="rounded-2xl border border-[var(--border-light)] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
            <TrendingUp className="h-5 w-5 text-[var(--primary)]" />
          </div>

          <div>
            <p className="text-xs font-medium text-[var(--text-muted)]">
              Total Order Value
            </p>

            <p className="mt-1 text-2xl font-bold text-[var(--dark)]">
              {loading
                ? "—"
                : `Rs. ${stats.totalSales.toLocaleString("en-PK")}`}
            </p>
          </div>
        </div>
      </section>

      {/* Recent Orders */}
      <section className="overflow-hidden rounded-2xl border border-[var(--border-light)] bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border-light)] px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-base font-semibold text-[var(--dark)]">
              Recent Orders
            </h2>

            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              Latest customer orders
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[var(--primary)] transition-colors hover:opacity-80"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center px-5 py-12 text-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-[var(--primary)]" />

            <p className="mt-4 text-sm text-[var(--text-muted)]">
              Loading orders...
            </p>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center px-5 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background-soft)]">
              <Package className="h-5 w-5 text-[var(--text-muted)]" />
            </div>

            <h3 className="mt-4 text-base font-semibold text-[var(--dark)]">
              No orders yet
            </h3>

            <p className="mt-1 max-w-sm text-sm leading-6 text-[var(--text-muted)]">
              Customer orders will appear here when they are placed.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-light)]">
            {recentOrders.map((order) => (
              <RecentOrder key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ----------------------------- */
/* Stat Card */
/* ----------------------------- */

function StatCard({
  label,
  value,
  icon,
  valueClass = "text-[var(--dark)]",
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-light)] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium text-[var(--text-muted)] sm:text-xs">
            {label}
          </p>

          <p
            className={`mt-2 text-2xl font-bold sm:text-3xl ${valueClass}`}
          >
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--background-soft)] text-[var(--text-muted)]">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- */
/* Recent Order */
/* ----------------------------- */

function RecentOrder({ order }: { order: Order }) {
  const statusStyles: Record<Order["status"], string> = {
    pending:
      "border-amber-200 bg-amber-50 text-amber-700",
    confirmed:
      "border-blue-200 bg-blue-50 text-blue-700",
    delivered:
      "border-green-200 bg-green-50 text-green-700",
    cancelled:
      "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <Link
      href="/admin/orders"
      className="flex min-w-0 items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-[var(--background-soft)] sm:px-6"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[var(--dark)]">
          {order.customer.name}
        </p>

        <p className="mt-1 truncate font-mono text-[11px] text-[var(--text-muted)]">
          #{order.id}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span
          className={`hidden rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize sm:inline-flex ${statusStyles[order.status]}`}
        >
          {order.status}
        </span>

        <span className="text-sm font-bold text-[var(--dark)]">
          Rs. {order.subtotal.toLocaleString("en-PK")}
        </span>

        <ArrowRight className="h-4 w-4 text-[var(--text-muted)]" />
      </div>
    </Link>
  );
}