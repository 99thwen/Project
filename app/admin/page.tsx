"use client";

import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ClipboardList,
  Package,
  ShoppingBag,
  Tags,
} from "lucide-react";

import { db } from "@/lib/firebase";
import { products } from "@/data/products";
import { categories } from "@/data/categories";

export default function AdminDashboard() {
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [pendingOrderCount, setPendingOrderCount] =
    useState<number | null>(null);

  useEffect(() => {
    const ordersRef = collection(db, "orders");

    const unsubscribe = onSnapshot(
      ordersRef,
      (snapshot) => {
        const orders = snapshot.docs.map((doc) => doc.data());

        setOrderCount(orders.length);

        setPendingOrderCount(
          orders.filter(
            (order) => order.status === "pending"
          ).length
        );
      },
      (error) => {
        console.error("Failed to load orders:", error);
        setOrderCount(0);
        setPendingOrderCount(0);
      }
    );

    return unsubscribe;
  }, []);

  const stats = [
    {
      label: "Products",
      value: products.length,
      icon: Package,
    },
    {
      label: "Orders",
      value: orderCount ?? "—",
      icon: ShoppingBag,
    },
    {
      label: "Pending Orders",
      value: pendingOrderCount ?? "—",
      icon: ClipboardList,
    },
    {
      label: "Categories",
      value: categories.length,
      icon: Tags,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[var(--dark)]">
          Dashboard
        </h1>

        <p className="mt-1.5 text-sm text-[var(--text-muted)]">
          Overview of your Jaji Electronics store.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-[var(--border-light)] bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[var(--text-muted)]">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-[28px] font-semibold tracking-tight text-[var(--dark)]">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--background-soft)]">
                  <Icon className="h-[18px] w-[18px] text-[var(--primary)]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Overview */}
      <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium text-[var(--dark)]">
              Store Overview
            </h2>

            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Your catalog is ready and orders are managed from the admin panel.
            </p>
          </div>

          <div className="hidden h-10 w-10 items-center justify-center rounded-lg bg-[var(--background-soft)] sm:flex">
            <ShoppingBag className="h-5 w-5 text-[var(--primary)]" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-[var(--border-light)] pt-5 sm:grid-cols-3">
          <div>
            <p className="text-xs text-[var(--text-muted)]">
              Catalog
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--dark)]">
              {products.length} products
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--text-muted)]">
              Orders
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--dark)]">
              {orderCount ?? "—"} total
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--text-muted)]">
              Pending
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--dark)]">
              {pendingOrderCount ?? "—"} awaiting action
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}