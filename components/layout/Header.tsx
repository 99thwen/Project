"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import { useCart } from "@/components/cart/CartContext";

export default function Header() {
  const router = useRouter();
  const { itemCount, cartMessage } = useCart();

  const [search, setSearch] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = search.trim();

    if (!query) return;

    setMobileMenuOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  function closeMenus() {
    setCategoriesOpen(false);
    setBrandsOpen(false);
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-white">

      {/* =====================================================
          MAIN HEADER
      ====================================================== */}
      <div className="border-b border-[var(--border-light)] bg-white">
        <div className="container-main flex h-[64px] items-center gap-8">

          {/* LOGO */}
          <Link
            href="/"
            className="flex h-[58px] w-[155px] shrink-0 items-center"
            aria-label="Jaji Electronics home"
          >
            <Image
              src="/logo.webp"
              alt="Jaji Electronics"
              width={180}
              height={80}
              className="h-full w-full object-contain"
              priority
            />
          </Link>

          {/* SEARCH */}
          <div className="flex min-w-0 flex-1 justify-center">
            <form
              onSubmit={handleSearch}
              className="relative w-full max-w-[620px]"
            >
              <label htmlFor="header-search" className="sr-only">
                Search products
              </label>

              <input
                id="header-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search for products, brands or categories..."
                className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background-soft)] px-4 pr-14 text-[13px] text-[var(--dark)] outline-none transition-all placeholder:text-[var(--text-light)] focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary)]/10"
              />

              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1 top-1 flex h-9 w-10 items-center justify-center rounded-md bg-[var(--primary)] text-white transition-colors hover:bg-[var(--primary-hover)]"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* ACTIONS */}
          <div className="flex shrink-0 items-center gap-2">

            {/* ACCOUNT */}
            <button
              type="button"
              aria-label="Account"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--dark)] transition-all hover:border-[var(--primary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
            >
              <UserRound className="h-5 w-5" />
            </button>

            {/* WISHLIST */}
            <button
              type="button"
              aria-label="Wishlist"
              className="hidden h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--dark)] transition-all hover:border-[var(--primary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] sm:flex"
            >
              <Heart className="h-5 w-5" />
            </button>

            {/* CART */}
            <div className="relative">
              <Link
                href="/cart"
                aria-label={`Shopping cart${
                  itemCount > 0 ? `, ${itemCount} items` : ""
                }`}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--dark)] transition-all hover:border-[var(--primary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
              >
                <ShoppingCart className="h-5 w-5" />

                {itemCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[var(--primary)] px-1 text-[10px] font-bold leading-none text-white">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>

              {cartMessage && (
                <div className="absolute right-0 top-12 z-[100] whitespace-nowrap rounded-lg bg-[var(--dark)] px-3 py-2 text-xs font-semibold text-white shadow-lg">
                  {cartMessage}
                </div>
              )}
            </div>

            {/* MOBILE MENU */}
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--dark)] transition-all hover:border-[var(--primary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          DESKTOP NAVIGATION
      ====================================================== */}
      <nav className="hidden border-b border-[#1B4382] bg-[#22539E] md:block">
        <div className="container-main flex h-[48px] items-center">

          {/* ALL CATEGORIES */}
          <div
            className="relative h-full shrink-0"
            onMouseEnter={() => {
              setCategoriesOpen(true);
              setBrandsOpen(false);
            }}
            onMouseLeave={() => {
              setCategoriesOpen(false);
            }}
          >
            <button
              type="button"
              onClick={() => {
                setCategoriesOpen((open) => !open);
                setBrandsOpen(false);
              }}
              className={`flex h-10 items-center gap-2 rounded-md px-4 text-[13px] font-semibold text-white transition-colors ${
                categoriesOpen
                  ? "bg-white/15"
                  : "bg-white/10 hover:bg-white/15"
              }`}
              aria-expanded={categoriesOpen}
            >
              <Menu className="h-4 w-4" />

              <span>All Categories</span>

              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  categoriesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* CATEGORY DROPDOWN */}
            {categoriesOpen && (
              <div className="absolute left-0 top-full z-[100] w-72 overflow-hidden rounded-b-lg border border-[var(--border)] bg-white py-2 shadow-[var(--shadow-lg)]">

                <div className="border-b border-[var(--border-light)] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    Shop by Category
                  </p>
                </div>

                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    onClick={closeMenus}
                    className="flex items-center px-4 py-2.5 text-sm text-[var(--text)] transition-colors hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* FEATURED CATEGORIES */}
          <div className="ml-4 flex min-w-0 flex-1 items-center">

            <div className="flex min-w-0 items-center gap-1 overflow-hidden">

              {[
                "split-ac",
                "washing-machine",
                "refrigerator",
                "deep-freezer",
                "dispenser",
              ]
                .map((slug) =>
                  categories.find(
                    (category) => category.slug === slug
                  )
                )
                .filter(
                  (
                    category
                  ): category is (typeof categories)[number] =>
                    Boolean(category)
                )
                .map((category) => (
                <Link
  key={category.id}
  href={`/category/${category.slug}`}
  onClick={closeMenus}
  className="flex h-10 shrink-0 items-center whitespace-nowrap rounded-md px-3 text-[13px] font-medium !text-white transition-colors hover:bg-white/10"
>
  {category.name}
</Link>
                ))}
            </div>

            {/* ALL BRANDS */}
            <div
              className="relative ml-auto h-10 shrink-0 border-l border-white/20 pl-4"
              onMouseEnter={() => {
                setBrandsOpen(true);
                setCategoriesOpen(false);
              }}
              onMouseLeave={() => {
                setBrandsOpen(false);
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setBrandsOpen((open) => !open);
                  setCategoriesOpen(false);
                }}
                className={`flex h-10 items-center gap-1.5 whitespace-nowrap rounded-md px-3 text-[12px] font-medium transition-colors ${
                  brandsOpen
                    ? "bg-white/15 text-white"
                    : "text-white hover:bg-white/10"
                }`}
                aria-expanded={brandsOpen}
              >
                <span>All Brands</span>

                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    brandsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* BRANDS DROPDOWN */}
              {brandsOpen && (
                <div className="absolute right-0 top-full z-[100] w-64 overflow-hidden rounded-b-lg border border-[var(--border)] bg-white shadow-[var(--shadow-lg)]">

                  <div className="border-b border-[var(--border-light)] px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                      Shop by Brand
                    </p>
                  </div>

                  <div className="max-h-[70vh] overflow-y-auto py-2">
                    {brands.map((brand) => (
                      <Link
                        key={brand.id}
                        href={`/brand/${brand.slug}`}
                        onClick={closeMenus}
                        className="flex items-center px-4 py-2.5 text-sm text-[var(--text)] transition-colors hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
                      >
                        {brand.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* =====================================================
          MOBILE SEARCH
      ====================================================== */}
      <div className="border-b border-[var(--border-light)] bg-white px-4 py-3 md:hidden">
        <form onSubmit={handleSearch} className="relative">
          <label htmlFor="mobile-search" className="sr-only">
            Search products
          </label>

          <input
            id="mobile-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background-soft)] px-4 pr-14 text-sm text-[var(--dark)] outline-none transition-all placeholder:text-[var(--text-light)] focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary)]/10"
          />

          <button
            type="submit"
            aria-label="Search"
            className="absolute right-1 top-1 flex h-9 w-10 items-center justify-center rounded-md bg-[var(--primary)] text-white transition-colors hover:bg-[var(--primary-hover)]"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}
      {mobileMenuOpen && (
        <div className="border-b border-[var(--border)] bg-white shadow-lg md:hidden">
          <div className="container-main py-4">

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="rounded-lg bg-[var(--background-soft)] px-4 py-3 text-sm font-semibold text-[var(--navy)] transition-colors hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
              >
                Home
              </Link>

              <Link
                href="/shop"
                onClick={closeMobileMenu}
                className="rounded-lg bg-[var(--background-soft)] px-4 py-3 text-sm font-semibold text-[var(--navy)] transition-colors hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
              >
                Shop All
              </Link>
            </div>

            <div className="mt-5">
              <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Categories
              </p>

              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    onClick={closeMobileMenu}
                    className="rounded-lg px-3 py-2.5 text-sm text-[var(--text)] transition-colors hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-5 border-t border-[var(--border-light)] pt-5">
              <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Brands
              </p>

              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                {brands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/brand/${brand.slug}`}
                    onClick={closeMobileMenu}
                    className="rounded-lg px-3 py-2.5 text-sm text-[var(--text)] transition-colors hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
                  >
                    {brand.name}
                  </Link>
                ))}
              </div>
            </div>

            <a
              href="tel:03359864000"
              className="mt-5 flex items-center justify-center rounded-lg bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
            >
              Call Jaji Electronics · 0335 9864000
            </a>
          </div>
        </div>
      )}
    </header>
  );
}