"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";

import AdminGuard from "@/components/admin/AdminGuard";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
if (pathname === "/admin/login") {
  return <>{children}</>;
}

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[var(--background-soft)]">

        {/* Top Navbar */}
        <header className="sticky top-0 z-40 border-b border-[var(--border-light)] bg-white">

          <div className="flex h-[64px] items-center justify-between px-4 sm:h-[72px] sm:px-8">
            
<div className="mb-8 text-center">
  <div className="mb-6 flex justify-center">
    <Image
      src="/logo.webp"
      alt="Jaji Electronics"
      width={240}
      height={110}
      className="h-24 w-auto object-contain"
      priority
    />
  </div>

  <p className="text-sm text-[var(--text-muted)]">
    Admin Dashboard
  </p>
</div>
            {/* View Store */}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-light)] bg-white px-3 py-2 text-[13px] font-medium text-[var(--dark)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] sm:gap-2 sm:px-3.5 sm:text-sm"
            >
              <span>View Store</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile Management Navigation */}
          <div className="border-t border-[var(--border-light)] bg-white md:hidden">
            <nav className="grid grid-cols-3 gap-1 px-3 py-2">

              {navigation.map((item) => {
                const Icon = item.icon;

                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[12px] font-medium transition ${
                      isActive
                        ? "bg-orange-50 text-[var(--primary)]"
                        : "text-[var(--text-muted)] hover:bg-[var(--background-soft)] hover:text-[var(--primary)]"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        isActive
                          ? "text-[var(--primary)]"
                          : "text-[var(--text-muted)]"
                      }`}
                    />

                    <span>{item.name}</span>
                  </Link>
                );
              })}

            </nav>
          </div>
        </header>

        {/* Main Layout */}
        <div className="flex min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)]">

          {/* Desktop Sidebar */}
          <aside className="hidden w-60 shrink-0 border-r border-[var(--border-light)] bg-white md:block">
            <div className="sticky top-[72px] p-4">

              <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Management
              </p>

              <nav className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? "bg-orange-50 text-[var(--primary)]"
                          : "text-[var(--dark)] hover:bg-[var(--background-soft)] hover:text-[var(--primary)]"
                      }`}
                    >
                      <Icon
                        className={`h-[18px] w-[18px] ${
                          isActive
                            ? "text-[var(--primary)]"
                            : "text-[var(--text-muted)] group-hover:text-[var(--primary)]"
                        }`}
                      />

                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Store Shortcut */}
              <div className="mt-8 border-t border-[var(--border-light)] pt-5">
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-[var(--text-muted)] transition hover:bg-[var(--background-soft)] hover:text-[var(--primary)]"
                >
                  <ExternalLink className="h-[18px] w-[18px]" />
                  View Store
                </Link>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="min-w-0 flex-1 p-4 sm:p-7 lg:p-8">
            <div className="mx-auto w-full max-w-[1400px]">
              {children}
            </div>
          </main>

        </div>
      </div>
    </AdminGuard>
  );
}