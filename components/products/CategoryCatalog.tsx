"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown, X } from "lucide-react";

import { brands } from "@/data/brands";
import { categories } from "@/data/categories";
import type { Product } from "@/types/product";
import ProductGrid from "@/components/products/ProductGrid";

type SortOption =
  | "featured"
  | "price-low"
  | "price-high"
  | "name";

type PriceFilter =
  | "all"
  | "under-50000"
  | "50000-100000"
  | "100000-200000"
  | "over-200000";

interface CategoryCatalogProps {
  products: Product[];
  initialCategory?: string;
  initialBrand?: string;
}

function FilterDropdown({
  label,
  active = false,
  open,
  onToggle,
  onClose,
  children,
}: {
  label: string;
  active?: boolean;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: ReactNode;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
  type="button"
  onClick={onToggle}
  aria-expanded={open}
  aria-haspopup="true"
  className={`group flex h-11 items-center gap-2 rounded-xl border px-4 text-[12px] font-medium transition-all duration-200 sm:text-[13px] ${
    active || open
      ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-sm"
      : "border-[var(--border)] bg-white text-[var(--dark)] hover:border-[var(--primary)]/40 hover:bg-[var(--background-soft)]"
  }`}
>
  <span>{label}</span>

  <ChevronDown
    className={`h-3.5 w-3.5 transition-transform duration-200 ${
      open ? "rotate-180" : ""
    }`}
  />
</button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+8px)] z-50 min-w-[230px] overflow-hidden rounded-xl border border-[var(--border)] bg-white p-2 shadow-xl"
          role="menu"
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default function CategoryCatalog({
  products,
  initialCategory = "",
  initialBrand = "",
}: CategoryCatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialBrand ? [initialBrand] : [],
  );

  const [selectedCategory, setSelectedCategory] =
    useState(initialCategory);

  const [sortBy, setSortBy] =
    useState<SortOption>("featured");

  const [priceFilter, setPriceFilter] =
    useState<PriceFilter>("all");

  const [openDropdown, setOpenDropdown] =
    useState<string | null>(null);

  /* AVAILABLE BRANDS */
  const availableBrands = useMemo(() => {
    const brandIds = new Set(
      products.map((product) => product.brandId),
    );

    return brands.filter((brand) => brandIds.has(brand.id));
  }, [products]);

  /* AVAILABLE CATEGORIES */
  const availableCategories = useMemo(() => {
    const categoryIds = new Set(
      products.map((product) => product.categoryId),
    );

    return categories.filter((category) =>
      categoryIds.has(category.id),
    );
  }, [products]);

  /* FILTERED + SORTED PRODUCTS */
  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory) {
      result = result.filter(
        (product) =>
          product.categoryId === selectedCategory,
      );
    }

    if (selectedBrands.length > 0) {
      result = result.filter((product) =>
        selectedBrands.includes(product.brandId),
      );
    }

    if (priceFilter !== "all") {
      result = result.filter((product) => {
        const price = product.price;

        switch (priceFilter) {
          case "under-50000":
            return price < 50000;

          case "50000-100000":
            return price >= 50000 && price < 100000;

          case "100000-200000":
            return price >= 100000 && price <= 200000;

          case "over-200000":
            return price > 200000;

          default:
            return true;
        }
      });
    }

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;

        case "price-high":
          return b.price - a.price;

        case "name":
          return a.name.localeCompare(b.name);

        default:
          return 0;
      }
    });
  }, [
    products,
    selectedCategory,
    selectedBrands,
    priceFilter,
    sortBy,
  ]);

  /* URL */
  function updateUrl(
    category: string,
    brandList: string[],
  ) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    if (brandList.length === 1) {
      params.set("brand", brandList[0]);
    } else {
      params.delete("brand");
    }

    const query = params.toString();

    router.push(
      query ? `${pathname}?${query}` : pathname,
      {
        scroll: false,
      },
    );
  }

  /* CATEGORY */
  function handleCategoryChange(categoryId: string) {
    setSelectedCategory(categoryId);
    updateUrl(categoryId, selectedBrands);
    setOpenDropdown(null);
  }

  /* BRAND */
  function handleBrandChange(brandId: string) {
    const nextBrands = selectedBrands.includes(brandId)
      ? selectedBrands.filter((id) => id !== brandId)
      : [...selectedBrands, brandId];

    setSelectedBrands(nextBrands);
    updateUrl(selectedCategory, nextBrands);
  }

  /* CLEAR */
  function clearFilters() {
    setSelectedCategory("");
    setSelectedBrands([]);
    setPriceFilter("all");
    setOpenDropdown(null);

    router.push(pathname, {
      scroll: false,
    });
  }

  const hasFilters =
    Boolean(selectedCategory) ||
    selectedBrands.length > 0 ||
    priceFilter !== "all";

  function getPriceLabel() {
    switch (priceFilter) {
      case "under-50000":
        return "Under Rs. 50,000";

      case "50000-100000":
        return "Rs. 50,000 – 100,000";

      case "100000-200000":
        return "Rs. 100,000 – 200,000";

      case "over-200000":
        return "Over Rs. 200,000";

      default:
        return "";
    }
  }

  return (
    <div>
      {/* FILTER + SORT BAR */}
      <div className="mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {products.length}
            </span>{" "}
            products
          </p>

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(
                event.target.value as SortOption,
              )
            }
            className="h-10 rounded-xl border border-[var(--border)] bg-white px-3.5 text-[12px] font-medium text-[var(--dark)] outline-none transition-colors focus:border-[var(--primary)] sm:text-[13px]"
          >
            <option value="featured">Featured</option>
            <option value="price-low">
              Price: Low to High
            </option>
            <option value="price-high">
              Price: High to Low
            </option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        {/* FILTER CONTROLS */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {/* CATEGORIES */}
          <FilterDropdown
            label="Categories"
            active={Boolean(selectedCategory)}
            open={openDropdown === "categories"}
            onToggle={() =>
              setOpenDropdown(
                openDropdown === "categories"
                  ? null
                  : "categories",
              )
            }
            onClose={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              onClick={() => handleCategoryChange("")}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[12px] transition-colors ${
                !selectedCategory
                  ? "bg-[var(--primary-light)] text-[var(--primary)]"
                  : "text-[var(--dark)] hover:bg-[var(--background-soft)]"
              }`}
            >
              All Categories

              {!selectedCategory && (
                <Check className="h-3.5 w-3.5" />
              )}
            </button>

            {availableCategories.map((category) => {
              const isSelected =
                selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    handleCategoryChange(category.id)
                  }
                  className={`mt-1 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[12px] transition-colors ${
                    isSelected
                      ? "bg-[var(--primary-light)] text-[var(--primary)]"
                      : "text-[var(--dark)] hover:bg-[var(--background-soft)]"
                  }`}
                >
                  {category.name}

                  {isSelected && (
                    <Check className="h-3.5 w-3.5" />
                  )}
                </button>
              );
            })}
          </FilterDropdown>

          {/* BRANDS */}
          <FilterDropdown
            label={
              selectedBrands.length > 0
                ? `Brands (${selectedBrands.length})`
                : "Brands"
            }
            active={selectedBrands.length > 0}
            open={openDropdown === "brands"}
            onToggle={() =>
              setOpenDropdown(
                openDropdown === "brands"
                  ? null
                  : "brands",
              )
            }
            onClose={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              onClick={() => {
                setSelectedBrands([]);
                updateUrl(selectedCategory, []);
                setOpenDropdown(null);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[12px] transition-colors ${
                selectedBrands.length === 0
                  ? "bg-[var(--primary-light)] text-[var(--primary)]"
                  : "text-[var(--dark)] hover:bg-[var(--background-soft)]"
              }`}
            >
              All Brands

              {selectedBrands.length === 0 && (
                <Check className="h-3.5 w-3.5" />
              )}
            </button>

            <div className="my-1 h-px bg-[var(--border-light)]" />

            {availableBrands.map((brand) => {
              const isSelected =
                selectedBrands.includes(brand.id);

              return (
                <label
                  key={brand.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-[12px] text-[var(--dark)] hover:bg-[var(--background-soft)]"
                >
                  <span>{brand.name}</span>

                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() =>
                      handleBrandChange(brand.id)
                    }
                    className="h-3.5 w-3.5 rounded accent-[var(--primary)]"
                  />
                </label>
              );
            })}
          </FilterDropdown>

          {/* PRICE */}
          <FilterDropdown
            label="Price"
            active={priceFilter !== "all"}
            open={openDropdown === "price"}
            onToggle={() =>
              setOpenDropdown(
                openDropdown === "price"
                  ? null
                  : "price",
              )
            }
            onClose={() => setOpenDropdown(null)}
          >
            {[
              ["all", "All Prices"],
              ["under-50000", "Under Rs. 50,000"],
              ["50000-100000", "Rs. 50,000 – 100,000"],
              ["100000-200000", "Rs. 100,000 – 200,000"],
              ["over-200000", "Over Rs. 200,000"],
            ].map(([value, label]) => {
              const isSelected =
                priceFilter === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setPriceFilter(
                      value as PriceFilter,
                    );
                    setOpenDropdown(null);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[12px] transition-colors ${
                    isSelected
                      ? "bg-[var(--primary-light)] text-[var(--primary)]"
                      : "text-[var(--dark)] hover:bg-[var(--background-soft)]"
                  }`}
                >
                  {label}

                  {isSelected && (
                    <Check className="h-3.5 w-3.5" />
                  )}
                </button>
              );
            })}
          </FilterDropdown>

          {/* CLEAR */}
          {hasFilters && (
  <>
    <span className="mx-0.5 hidden h-5 w-px bg-[var(--border)] sm:block" />

    <button
      type="button"
      onClick={clearFilters}
      className="inline-flex h-11 items-center gap-1.5 rounded-xl px-3 text-[12px] font-medium text-[var(--text-muted)] transition-all duration-200 hover:bg-[var(--background-soft)] hover:text-[var(--primary)]"
    >
      <X className="h-3.5 w-3.5" />
      Clear
    </button>
  </>
)}
        </div>
      </div>

      {/* ACTIVE FILTERS */}
      {hasFilters && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {/* CATEGORY CHIP */}
          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-light)] px-3 py-1.5 text-[11px] font-medium text-[var(--primary)]">
              {
                categories.find(
                  (category) =>
                    category.id === selectedCategory,
                )?.name
              }

              <button
                type="button"
                onClick={() =>
                  handleCategoryChange("")
                }
                aria-label="Remove category filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* BRAND CHIPS */}
          {selectedBrands.map((brandId) => {
            const brand = brands.find(
              (item) => item.id === brandId,
            );

            if (!brand) return null;

            return (
              <span
                key={brandId}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-light)] px-3 py-1.5 text-[11px] font-medium text-[var(--primary)]"
              >
                {brand.name}

                <button
                  type="button"
                  onClick={() =>
                    handleBrandChange(brandId)
                  }
                  aria-label={`Remove ${brand.name} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}

          {/* PRICE CHIP */}
          {priceFilter !== "all" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-light)] px-3 py-1.5 text-[11px] font-medium text-[var(--primary)]">
              {getPriceLabel()}

              <button
                type="button"
                onClick={() =>
                  setPriceFilter("all")
                }
                aria-label="Remove price filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* PRODUCTS */}
      <div>
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <h3 className="text-lg font-semibold text-[#25256f]">
              No products found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}