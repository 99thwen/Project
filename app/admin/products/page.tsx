"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Package,
  Pencil,
  Search,
  SlidersHorizontal,
  XCircle,
} from "lucide-react";

import { products as localProducts } from "@/data/products";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import { auth } from "@/lib/firebase";
import type { Product } from "@/types/product";
import ProductEditorModal from "@/components/admin/ProductEditorModal";
import { getProductCloudinaryPublicIds } from "@/lib/cloudinaryAssets";
import {
  deleteProductPriceOverride,
  getProductPriceOverrides,
  type ProductPriceOverrides,
} from "@/lib/productPrices";

type Notice = {
  type: "success" | "warning" | "error";
  message: string;
};

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");

  const [products, setProducts] = useState<Product[]>(localProducts);
  const [productsLoading, setProductsLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");

  const [editorOpen, setEditorOpen] = useState(false);
  const [productToEdit, setProductToEdit] =
    useState<Product | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);

  const [priceOverrides, setPriceOverrides] =
    useState<ProductPriceOverrides>({});

  const [notice, setNotice] = useState<Notice | null>(null);

  // Load saved price overrides.
  useEffect(() => {
    let cancelled = false;

    async function loadPriceOverrides() {
      try {
        const overrides = await getProductPriceOverrides();

        if (!cancelled) {
          setPriceOverrides(overrides);
        }
      } catch (error) {
        console.error("Failed to load price overrides:", error);
      }
    }

    void loadPriceOverrides();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load the merged catalogue from the authenticated admin API.
  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const user = auth.currentUser;

        if (!user) {
          throw new Error("Please sign in again.");
        }

        const token = await user.getIdToken();

        const response = await fetch("/api/admin/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Could not load products.");
        }

        if (!cancelled) {
          setProducts(data.products as Product[]);
          setCatalogError("");
        }
      } catch (error) {
        console.error("Failed to load catalogue:", error);

        if (!cancelled) {
          setProducts(localProducts);
          setCatalogError(
            error instanceof Error
              ? error.message
              : "Could not load the saved catalogue.",
          );
        }
      } finally {
        if (!cancelled) {
          setProductsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  function getProductPrice(productId: string, defaultPrice: number) {
    return priceOverrides[productId] ?? defaultPrice;
  }

  function openAddProduct() {
    setNotice(null);
    setProductToEdit(null);
    setEditorOpen(true);
  }

  function openEditProduct(product: Product) {
    setNotice(null);

    // Pass the effective price into the editor, not an outdated base price.
    setProductToEdit({
      ...product,
      price: getProductPrice(product.id, product.price),
    });

    setEditorOpen(true);
  }

  async function handleSaveProduct(product: Product) {
    setSavingProduct(true);
    setNotice(null);

    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const token = await user.getIdToken();

      const response = await fetch("/api/admin/products", {
        method: productToEdit ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not save the product.");
      }

      // Update the page immediately after the API confirms the save.
      setProducts((current) => {
        const alreadyExists = current.some(
          (item) => item.id === product.id,
        );

        if (alreadyExists) {
          return current.map((item) =>
            item.id === product.id ? product : item,
          );
        }

        return [product, ...current];
      });

      setPriceOverrides((current) => ({
        ...current,
        [product.id]: product.price,
      }));

      setCatalogError("");

      // Refresh the merged catalogue without making a successful save fail
      // just because the follow-up refresh encounters a temporary error.
      try {
        const refresh = await fetch("/api/admin/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const refreshedData = await refresh.json();

        if (!refresh.ok) {
          throw new Error(
            refreshedData.error ?? "Could not refresh the catalogue.",
          );
        }

        setProducts(refreshedData.products as Product[]);
      } catch (refreshError) {
        console.error("Catalogue refresh failed:", refreshError);

        setNotice({
          type: "warning",
          message:
            "The product was saved, but the list could not refresh. Reload the page to verify the latest catalogue.",
        });
      }
    } finally {
      setSavingProduct(false);
    }
  }

  // Called only after the custom confirmation in ProductEditorModal.
const handleDeleteProduct = async (product: Product) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in again.");
  }

  const token = await user.getIdToken();

  // Delete the product through the authenticated admin API.
  const response = await fetch("/api/admin/products", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: product.id }),
  });

  let data: { error?: string } = {};

  try {
    data = await response.json();
  } catch {
    // Handle an unreadable response through the error below.
  }

  if (!response.ok) {
    throw new Error(
      data.error ?? "Could not remove the product.",
    );
  }

  // The server confirmed deletion, so update the list immediately.
  setProducts((current) =>
    current.filter((item) => item.id !== product.id),
  );

  setCatalogError("");
  setNotice(null);

  const warnings: string[] = [];

  // Remove the saved price override so an old price cannot
  // unexpectedly carry over if this product ID is reused.
  try {
    await deleteProductPriceOverride(product.id);

    setPriceOverrides((current) => {
      const next = { ...current };

      delete next[product.id];

      return next;
    });
  } catch (error) {
    console.error(
      "Product deleted, but its price override could not be removed:",
      error,
    );

    warnings.push(
      "The product was deleted, but its saved price override could not be removed.",
    );
  }

  // Clean up the product's images after deletion.
  const publicIds = getProductCloudinaryPublicIds(product);

  if (publicIds.length > 0) {
    try {
      const cleanupResponse = await fetch(
        "/api/admin/images",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ publicIds }),
        },
      );

      let cleanupResult: {
        error?: string;
        failed?: string[];
      } = {};

      try {
        cleanupResult = await cleanupResponse.json();
      } catch {
        // Treat an unreadable response as a cleanup failure.
      }

      if (
        !cleanupResponse.ok ||
        (cleanupResult.failed?.length ?? 0) > 0
      ) {
        throw new Error(
          cleanupResult.error ??
            "Some unused images could not be removed.",
        );
      }
    } catch (error) {
      console.error(
        "Product deleted, but image cleanup needs attention:",
        error,
      );

      warnings.push(
        "Some unused product images could not be cleaned up.",
      );
    }
  }

  if (warnings.length > 0) {
    setNotice({
      type: "warning",
      message: warnings.join(" "),
    });
  }
};

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const category = categories.find(
        (item) =>
          item.id === product.categoryId ||
          item.slug === product.categoryId,
      );

      const brand = brands.find(
        (item) =>
          item.id === product.brandId ||
          item.slug === product.brandId,
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

      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [products, search, categoryFilter, brandFilter]);

  return (
    <div className="w-full min-w-0 max-w-full space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[26px] font-bold text-[var(--dark)] sm:text-3xl">
            Products
          </h1>

          <p className="mt-1 text-[13px] text-[var(--text-muted)] sm:text-sm">
            {productsLoading
              ? "Loading catalogue..."
              : "Manage your store catalogue."}
          </p>
        </div>

<button
  type="button"
  onClick={openAddProduct}
  disabled={productsLoading}
  className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-[var(--primary)] px-5 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
>
  + Add Product
</button>
      </div>

      {/* In-page feedback instead of browser alerts */}
      {catalogError && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Catalogue warning: {catalogError}</p>
        </div>
      )}

      {notice && (
        <div
          role="status"
          className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${
            notice.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : notice.type === "warning"
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {notice.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : notice.type === "warning" ? (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}

          <p className="min-w-0 flex-1">{notice.message}</p>

          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss message"
            className="rounded p-0.5 opacity-70 hover:opacity-100"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

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
                {productsLoading ? "—" : products.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-light)] bg-white p-4 sm:p-5">
          <p className="text-[11px] text-[var(--text-muted)] sm:text-sm">
            Showing
          </p>
          <p className="mt-0.5 text-xl font-bold text-[var(--dark)] sm:text-2xl">
            {productsLoading ? "—" : filteredProducts.length}
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

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="h-10 w-full min-w-0 rounded-lg border border-[var(--border-light)] bg-white px-3 text-sm text-[var(--dark)] outline-none focus:border-[var(--primary)]"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={brandFilter}
            onChange={(event) => setBrandFilter(event.target.value)}
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
        <div className="border-b border-[var(--border-light)] px-4 py-4 sm:px-5">
          <h2 className="text-[20px] font-bold text-[var(--dark)] sm:text-xl">
            Product Catalog
          </h2>

          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Mobile list */}
        <div className="min-w-0 divide-y divide-[var(--border-light)] md:hidden">
          {filteredProducts.map((product) => {
            const category = categories.find(
              (item) =>
                item.id === product.categoryId ||
                item.slug === product.categoryId,
            );

            const brand = brands.find(
              (item) =>
                item.id === product.brandId ||
                item.slug === product.brandId,
            );

            const currentPrice = getProductPrice(
              product.id,
              product.price,
            );

            return (
              <div
                key={product.id}
                className="flex min-w-0 max-w-full items-center gap-3 overflow-hidden px-4 py-3.5"
              >
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

                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="truncate text-[13px] font-semibold leading-5 text-[var(--dark)]">
                    {product.name}
                  </p>

                  {product.model && (
                    <p className="mt-0.5 truncate text-[10px] text-[var(--text-muted)]">
                      {product.model}
                    </p>
                  )}

                  <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-2">
                    <span className="text-[12px] font-semibold text-[var(--dark)]">
                      Rs. {currentPrice.toLocaleString("en-PK")}
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

                  {/* The single product action */}
                  <button
                    type="button"
                    onClick={() => openEditProduct(product)}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-light)] px-3 py-1.5 text-xs font-semibold text-[var(--primary)] transition hover:bg-[var(--background-soft)]"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop table */}
        <div className="hidden w-full overflow-x-auto md:block">
          <table className="w-full min-w-[850px] text-left">
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
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--border-light)]">
              {filteredProducts.map((product) => {
                const category = categories.find(
                  (item) =>
                    item.id === product.categoryId ||
                    item.slug === product.categoryId,
                );

                const brand = brands.find(
                  (item) =>
                    item.id === product.brandId ||
                    item.slug === product.brandId,
                );

                const currentPrice = getProductPrice(
                  product.id,
                  product.price,
                );

                return (
                  <tr
                    key={product.id}
                    className="transition hover:bg-[var(--background-soft)]"
                  >
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

                    <td className="px-5 py-4 text-sm text-[var(--dark)]">
                      {brand?.name ?? product.brandId ?? "—"}
                    </td>

                    <td className="px-5 py-4 text-sm text-[var(--dark)]">
                      {category?.name ?? product.categoryId ?? "—"}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[var(--dark)]">
                      Rs. {currentPrice.toLocaleString("en-PK")}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        Active
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => openEditProduct(product)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-light)] px-3 py-2 text-xs font-semibold text-[var(--primary)] transition hover:bg-[var(--background-soft)]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {!productsLoading && filteredProducts.length === 0 && (
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

        {productsLoading && (
          <div className="px-6 py-10 text-center text-sm text-[var(--text-muted)]">
            Loading products...
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <ProductEditorModal
        open={editorOpen}
        initialProduct={productToEdit}
        categories={categories}
        brands={brands}
        saving={savingProduct}
        onClose={() => {
          if (savingProduct) return;

          setEditorOpen(false);
          setProductToEdit(null);
        }}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
}