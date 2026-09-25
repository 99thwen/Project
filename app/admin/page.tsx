"use client";

import {
  collection,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

import { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

import {
  ClipboardList,
  Package,
  ShoppingBag,
  Tags,
} from "lucide-react";

import { auth, db } from "@/lib/firebase";
import { products } from "@/data/products";
import { categories } from "@/data/categories";

export default function AdminDashboard() {
  const router = useRouter();

  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [pendingOrderCount, setPendingOrderCount] =
    useState<number | null>(null);

  useEffect(() => {
    let unsubscribeOrders: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) {
          router.replace("/admin/login");
          return;
        }

        try {
          const adminRef = doc(db, "admins", user.uid);
          const adminSnapshot = await getDoc(adminRef);

          if (
            !adminSnapshot.exists() ||
            adminSnapshot.data().role !== "admin"
          ) {
            await signOut(auth);
            router.replace("/admin/login");
            return;
          }

          const ordersRef = collection(db, "orders");

          unsubscribeOrders = onSnapshot(
            ordersRef,
            (snapshot) => {
              const orders = snapshot.docs.map((document) =>
                document.data()
              );

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
        } catch (error) {
          console.error("Admin verification failed:", error);

          await signOut(auth).catch(() => {});
          router.replace("/admin/login");
        }
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribeOrders?.();
    };
  }, [router]);

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
    <div className="space-y-6 sm:space-y-8">

      {/* Page Header */}
      <div>
        <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[var(--dark)] sm:text-[28px]">
          Dashboard
        </h1>

        <p className="mt-1 text-[13px] text-[var(--text-muted)] sm:mt-1.5 sm:text-sm">
          Overview of your Jaji Electronics store.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-[var(--border-light)] bg-white p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[12px] text-[var(--text-muted)] sm:text-sm">
                    {stat.label}
                  </p>

                  <p className="mt-1.5 text-[24px] font-semibold tracking-tight text-[var(--dark)] sm:mt-2 sm:text-[28px]">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--background-soft)] sm:h-9 sm:w-9">
                  <Icon className="h-4 w-4 text-[var(--primary)] sm:h-[18px] sm:w-[18px]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Store Overview */}
      <div className="rounded-xl border border-[var(--border-light)] bg-white p-4 sm:p-6">

        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[17px] font-semibold text-[var(--dark)] sm:text-xl">
              Store Overview
            </h2>

            <p className="mt-1 max-w-2xl text-[12px] leading-5 text-[var(--text-muted)] sm:text-sm sm:leading-normal">
              Your catalog is ready and orders are managed from the admin panel.
            </p>
          </div>

          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--background-soft)] sm:flex">
            <ShoppingBag className="h-5 w-5 text-[var(--primary)]" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[var(--border-light)] pt-4 sm:mt-6 sm:gap-4 sm:pt-5">

          <div>
            <p className="text-[10px] text-[var(--text-muted)] sm:text-xs">
              Catalog
            </p>

            <p className="mt-1 text-[13px] font-medium text-[var(--dark)] sm:text-sm">
              {products.length} products
            </p>
          </div>

          <div>
            <p className="text-[10px] text-[var(--text-muted)] sm:text-xs">
              Orders
            </p>

            <p className="mt-1 text-[13px] font-medium text-[var(--dark)] sm:text-sm">
              {orderCount ?? "—"} total
            </p>
          </div>

          <div>
            <p className="text-[10px] text-[var(--text-muted)] sm:text-xs">
              Pending
            </p>

            <p className="mt-1 text-[13px] font-medium text-[var(--dark)] sm:text-sm">
              {pendingOrderCount ?? "—"} awaiting
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}