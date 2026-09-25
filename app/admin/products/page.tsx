"use client";

import { useMemo, useState } from "react";
import {
  Eye,
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--dark)]">
          Products
        </h1>

        <p className="mt-1 text-sm text-[var(--text-muted)]">
          View your store catalog.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--background-soft)]">
              <Package className="h-5 w-5 text-[var(--primary)]" />
            </div>

            <div>
              <p className="text-sm text-[var(--text-muted)]">
                Total Products
              </p>

              <p className="text-2xl font-bold text-[var(--dark)]">
                {localProducts.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
          <p className="text-sm text-[var(--text-muted)]">
            Showing
          </p>

          <p className="mt-1 text-2xl font-bold text-[var(--dark)]">
            {filteredProducts.length}
          </p>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Matching current filters
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-[var(--border-light)] bg-white p-4">
        <div className="mb-4 flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[var(--primary)]" />

          <p className="text-sm font-semibold text-[var(--dark)]">
            Filter Products
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px]">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products, brands, categories or models..."
              className="w-full rounded-lg border border-[var(--border-light)] bg-white py-2.5 pl-10 pr-4 text-sm text-[var(--dark)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]"
            />
          </div>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
            className="rounded-lg border border-[var(--border-light)] bg-white px-3 py-2.5 text-sm text-[var(--dark)] outline-none focus:border-[var(--primary)]"
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
            className="rounded-lg border border-[var(--border-light)] bg-white px-3 py-2.5 text-sm text-[var(--dark)] outline-none focus:border-[var(--primary)]"
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

      {/* Catalog */}
      <div className="overflow-hidden rounded-xl border border-[var(--border-light)] bg-white">
        <div className="border-b border-[var(--border-light)] px-5 py-4">
          <h2 className="text-sm font-semibold text-[var(--dark)]">
            Product Catalog
          </h2>

          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="overflow-x-auto">
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
                        Rs. {product.price.toLocaleString()}
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
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-light)] px-3 py-2 text-xs font-medium text-[var(--text-muted)]">
                        <Eye className="h-3.5 w-3.5" />
                        Catalog
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
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