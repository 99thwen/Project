"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";

import { brands } from "@/data/brands";
import { categories } from "@/data/categories";
import type { Product } from "@/types/product";
import ProductGrid from "@/components/products/ProductGrid";

type SortOption = "featured" | "price-low" | "price-high" | "name";

interface CategoryCatalogProps {
  products: Product[];
  initialCategory?: string;
  initialBrand?: string;
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
    initialBrand ? [initialBrand] : []
  );

  const [selectedCategory, setSelectedCategory] =
    useState(initialCategory);

  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const availableBrands = useMemo(() => {
    const brandIds = new Set(products.map((product) => product.brandId));

    return brands.filter((brand) => brandIds.has(brand.id));
  }, [products]);

  const availableCategories = useMemo(() => {
    const categoryIds = new Set(products.map((product) => product.categoryId));

    return categories.filter((category) => categoryIds.has(category.id));
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory) {
      result = result.filter(
        (product) => product.categoryId === selectedCategory
      );
    }

    if (selectedBrands.length > 0) {
      result = result.filter((product) =>
        selectedBrands.includes(product.brandId)
      );
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
  }, [products, selectedCategory, selectedBrands, sortBy]);

  function updateUrl(category: string, brandList: string[]) {
    const params = new URLSearchParams(searchParams.toString());

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

    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function handleCategoryChange(categoryId: string) {
    setSelectedCategory(categoryId);
    updateUrl(categoryId, selectedBrands);
  }

  function handleBrandChange(brandId: string) {
    const nextBrands = selectedBrands.includes(brandId)
      ? selectedBrands.filter((id) => id !== brandId)
      : [...selectedBrands, brandId];

    setSelectedBrands(nextBrands);
    updateUrl(selectedCategory, nextBrands);
  }

  function clearFilters() {
    setSelectedCategory("");
    setSelectedBrands([]);

    router.push(pathname, {
      scroll: false,
    });
  }

  const hasFilters = selectedCategory || selectedBrands.length > 0;

  const priceValues = products
    .map((product) => product.price)
    .filter((price) => price > 0);

  const minPrice = priceValues.length ? Math.min(...priceValues) : 0;
  const maxPrice = priceValues.length ? Math.max(...priceValues) : 0;

  function Filters() {
    return (
      <div className="space-y-7">
        {/* Categories */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#25256f]">
              Categories
            </h3>

            {selectedCategory && (
              <button
                type="button"
                onClick={() => handleCategoryChange("")}
                className="text-xs font-medium text-[#f58220] hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-3">
            {availableCategories.map((category) => (
              <label
                key={category.id}
                className="flex cursor-pointer items-center gap-3 text-sm text-slate-600"
              >
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === category.id}
                  onChange={() => handleCategoryChange(category.id)}
                  className="h-4 w-4 accent-[#f58220]"
                />

                <span>{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#25256f]">
              Brands
            </h3>

            {selectedBrands.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedBrands([]);
                  updateUrl(selectedCategory, []);
                }}
                className="text-xs font-medium text-[#f58220] hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-3">
            {availableBrands.map((brand) => (
              <label
                key={brand.id}
                className="flex cursor-pointer items-center gap-3 text-sm text-slate-600"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() => handleBrandChange(brand.id)}
                  className="h-4 w-4 rounded accent-[#f58220]"
                />

                <span>{brand.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price information */}
        <div className="border-t border-slate-100 pt-6">
          <h3 className="mb-3 text-sm font-semibold text-[#25256f]">
            Price
          </h3>

          {priceValues.length > 0 ? (
            <p className="text-sm text-slate-500">
              Products currently range from{" "}
              <span className="font-medium text-slate-700">
                Rs. {minPrice.toLocaleString()}
              </span>{" "}
              to{" "}
              <span className="font-medium text-slate-700">
                Rs. {maxPrice.toLocaleString()}
              </span>
            </p>
          ) : (
            <p className="text-sm text-slate-500">
              Price information unavailable.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
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

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 lg:hidden"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as SortOption)
            }
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none focus:border-[#f58220]"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Active filters */}
      {hasFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {selectedCategory && (
            <button
              type="button"
              onClick={() => handleCategoryChange("")}
              className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-medium text-[#f58220]"
            >
              {
                categories.find(
                  (category) => category.id === selectedCategory
                )?.name
              }
              <X size={13} />
            </button>
          )}

          {selectedBrands.map((brandId) => {
            const brand = brands.find((item) => item.id === brandId);

            if (!brand) return null;

            return (
              <button
                key={brandId}
                type="button"
                onClick={() => handleBrandChange(brandId)}
                className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-medium text-[#f58220]"
              >
                {brand.name}
                <X size={13} />
              </button>
            );
          })}

          <button
            type="button"
            onClick={clearFilters}
            className="ml-1 text-xs font-medium text-slate-500 hover:text-[#f58220]"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-xl border border-slate-200 bg-white p-5">
            <Filters />
          </div>
        </aside>

        {/* Products */}
        <div>
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
              <h3 className="text-lg font-semibold text-[#25256f]">
                No products found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your category or brand filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-lg bg-[#f58220] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-white p-6 shadow-xl">
            <div className="mb-7 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#25256f]">
                Filters
              </h2>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <Filters />

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-8 w-full rounded-lg bg-[#f58220] py-3 text-sm font-semibold text-white"
            >
              Show {filteredProducts.length} Products
            </button>
          </div>
        </div>
      )}
    </div>
  );
}