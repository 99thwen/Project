"use client";

import { useMemo, useState } from "react";
import {
  Package,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { products as localProducts } from "@/data/products";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return localProducts.filter((product) => {
      const category = categories.find(
        (item) =>
          item.id === product.categoryId ||
          item.slug === product.categoryId
      );

      const brand = brands.find(
        (item) =>
          item.id === product.brandId ||
          item.slug === product.brandId
      );

      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.slug.toLowerCase().includes(query) ||
        product.model?.toLowerCase().includes(query) ||
        category?.name.toLowerCase().includes(query) ||
        brand?.name.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "all" ||
        product.categoryId === categoryFilter;

      const matchesBrand =
        brandFilter === "all" ||
        product.brandId === brandFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand
      );
    });
  }, [search, categoryFilter, brandFilter]);

  return (
    <div className="w-full min-w-0 max-w-full space-y-5 overflow-x-hidden sm:space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-[26px] font-bold text-[var(--dark)] sm:text-3xl">
          Products
        </h1>

        <p className="mt-1 text-[13px] text-[var(--text-muted)] sm:text-sm">
          View your store catalog.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">

        <div className="rounded-xl border border-[var(--border-light)] bg-white p-4 sm:p-5">
          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--background-soft)] sm:h-10 sm:w-10">
              <Package className="h-4 w-4 text-[var(--primary)] sm:h-5 sm:w-5" />
            </div>

            <div>
              <p className="text-[11px] text-[var(--text-muted)] sm:text-sm">
                Total Products
              </p>

              <p className="mt-0.5 text-xl font-bold text-[var(--dark)] sm:text-2xl">
                {localProducts.length}
              </p>
            </div>

          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-light)] bg-white p-4 sm:p-5">

          <p className="text-[11px] text-[var(--text-muted)] sm:text-sm">
            Showing
          </p>

          <p className="mt-0.5 text-xl font-bold text-[var(--dark)] sm:text-2xl">
            {filteredProducts.length}
          </p>

          <p className="mt-0.5 text-[10px] text-[var(--text-muted)] sm:text-xs">
            Products shown
          </p>

        </div>

      </div>

      {/* Filters */}
      <div className="w-full min-w-0 rounded-xl border border-[var(--border-light)] bg-white p-4">

        <div className="mb-4 flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-[var(--primary)]" />

          <p className="text-sm font-semibold text-[var(--dark)]">
            Filter Products
          </p>
        </div>

        <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px]">

          {/* Search */}
          <div className="relative min-w-0">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products, brands, categories or models..."
              className="h-10 w-full min-w-0 rounded-lg border border-[var(--border-light)] bg-white py-2.5 pl-10 pr-3 text-sm text-[var(--dark)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]"
            />

          </div>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
            className="h-10 w-full min-w-0 rounded-lg border border-[var(--border-light)] bg-white px-3 text-sm text-[var(--dark)] outline-none focus:border-[var(--primary)]"
          >
            <option value="all">All Categories</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Brand */}
          <select
            value={brandFilter}
            onChange={(event) =>
              setBrandFilter(event.target.value)
            }
            className="h-10 w-full min-w-0 rounded-lg border border-[var(--border-light)] bg-white px-3 text-sm text-[var(--dark)] outline-none focus:border-[var(--primary)]"
          >
            <option value="all">All Brands</option>

            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* Product Catalog */}
      <div className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-[var(--border-light)] bg-white">

        {/* Catalog Header */}
        <div className="border-b border-[var(--border-light)] px-4 py-4 sm:px-5">

          <h2 className="text-[20px] font-bold text-[var(--dark)] sm:text-xl">
            Product Catalog
          </h2>

          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>

        </div>

        {/* =====================================================
            MOBILE
        ===================================================== */}
        <div className="min-w-0 divide-y divide-[var(--border-light)] md:hidden">

          {filteredProducts.map((product) => {
            const category = categories.find(
              (item) =>
                item.id === product.categoryId ||
                item.slug === product.categoryId
            );

            const brand = brands.find(
              (item) =>
                item.id === product.brandId ||
                item.slug === product.brandId
            );

            return (
              <div
                key={product.id}
                className="flex min-w-0 max-w-full items-center gap-3 overflow-hidden px-4 py-3.5"
              >

                {/* Image */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--border-light)] bg-white">
                  <img
                    src={
                      product.image?.trim() ||
                      "/images/placeholder-product.jpg"
                    }
                    alt={product.name}
                    className="h-full w-full object-contain p-1.5"
                  />
                </div>

                {/* Product Info */}
                <div className="min-w-0 flex-1 overflow-hidden">

                  <p className="truncate text-[13px] font-semibold leading-5 text-[var(--dark)]">
                    {product.name}
                  </p>

                  {product.model && (
                    <p className="mt-0.5 truncate text-[10px] text-[var(--text-muted)]">
                      {product.model}
                    </p>
                  )}

                  <div className="mt-1.5 flex min-w-0 items-center gap-2">

                    <span className="shrink-0 text-[12px] font-semibold text-[var(--dark)]">
                      Rs. {product.price.toLocaleString("en-PK")}
                    </span>

                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-50 px-1.5 py-0.5 text-[9px] font-semibold text-green-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Active
                    </span>

                  </div>

                  <p className="mt-1 truncate text-[10px] text-[var(--text-muted)]">
                    {brand?.name ?? product.brandId ?? "—"}
                    {" • "}
                    {category?.name ?? product.categoryId ?? "—"}
                  </p>

                </div>

              </div>
            );
          })}

        </div>

        {/* =====================================================
            DESKTOP
        ===================================================== */}
        <div className="hidden w-full overflow-x-auto md:block">

          <table className="w-full min-w-[900px] text-left">

            <thead className="border-b border-[var(--border-light)] bg-[var(--background-soft)]">
              <tr>

                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  Product
                </th>

                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  Brand
                </th>

                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  Category
                </th>

                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  Price
                </th>

                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  Status
                </th>

                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                  Type
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--border-light)]">

              {filteredProducts.map((product) => {
                const category = categories.find(
                  (item) =>
                    item.id === product.categoryId ||
                    item.slug === product.categoryId
                );

                const brand = brands.find(
                  (item) =>
                    item.id === product.brandId ||
                    item.slug === product.brandId
                );

                return (
                  <tr
                    key={product.id}
                    className="transition hover:bg-[var(--background-soft)]"
                  >

                    {/* Product */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--border-light)] bg-white">

                          <img
                            src={
                              product.image?.trim() ||
                              "/images/placeholder-product.jpg"
                            }
                            alt={product.name}
                            className="h-full w-full object-contain p-1"
                          />

                        </div>

                        <div className="min-w-0">

                          <p className="max-w-[300px] truncate text-sm font-semibold text-[var(--dark)]">
                            {product.name}
                          </p>

                          {product.model && (
                            <p className="mt-1 text-xs text-[var(--text-muted)]">
                              {product.model}
                            </p>
                          )}

                        </div>

                      </div>

                    </td>

                    {/* Brand */}
                    <td className="px-5 py-4 text-sm text-[var(--dark)]">
                      {brand?.name ?? product.brandId ?? "—"}
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 text-sm text-[var(--dark)]">
                      {category?.name ?? product.categoryId ?? "—"}
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">

                      <span className="text-sm font-semibold text-[var(--dark)]">
                        Rs. {product.price.toLocaleString("en-PK")}
                      </span>

                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        Active
                      </span>

                    </td>

                    {/* Type */}
                    <td className="px-5 py-4 text-right">

                      <span className="inline-flex items-center rounded-lg border border-[var(--border-light)] px-3 py-2 text-xs font-medium text-[var(--text-muted)]">
                        Catalog
                      </span>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="px-6 py-14 text-center">

            <Search className="mx-auto h-8 w-8 text-[var(--text-muted)]" />

            <p className="mt-3 text-sm font-semibold text-[var(--dark)]">
              No products found
            </p>

            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Try a different search or filter.
            </p>

          </div>
        )}

      </div>
    </div>
  );
}