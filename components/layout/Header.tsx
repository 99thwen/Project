"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ChevronDown,
  ChevronRight,
  Menu,
  Search,
  ShoppingCart,
  X,
  Phone,
  Home,
  Grid2X2,
  Tag,
  Store,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import { useCart } from "@/components/cart/CartContext";

export default function Header() {
  const router = useRouter();
  const { itemCount, cartMessage } = useCart();

  const [search, setSearch] = useState("");

  // Desktop dropdowns
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);

  // Mobile drawer
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

useEffect(() => {
  if (!mobileMenuOpen) return;

  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = previousOverflow;
  };
}, [mobileMenuOpen]);


  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* =====================================================
          MAIN HEADER
      ====================================================== */}
      <div className="border-b border-[var(--border-light)] bg-white">
        <div className="container-main flex h-[64px] items-center gap-2 md:gap-8">

          {/* =====================================================
              MOBILE MENU BUTTON
          ====================================================== */}
         <button
  type="button"
  onClick={() => setMobileMenuOpen((prev) => !prev)}
  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
  aria-expanded={mobileMenuOpen}
  className="motion-icon-button flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[var(--dark)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)] md:hidden"
>
  {mobileMenuOpen ? (
    <X className="motion-icon h-[21px] w-[21px]" strokeWidth={2} />
  ) : (
    <Menu className="motion-icon h-[21px] w-[21px]" strokeWidth={2} />
  )}
</button>


          {/* =====================================================
              LOGO
          ====================================================== */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex h-[58px] min-w-0 shrink-0 items-center"
            aria-label="Jaji Electronics home"
          >
            <div className="flex items-center gap-2">
              <Image
                src="/logo.webp"
                alt="Jaji Electronics"
                width={38}
                height={38}
                className="h-[38px] w-[38px] object-contain"
              />

              <span className="whitespace-nowrap text-[15px] font-semibold tracking-[-0.02em] text-[var(--primary)] md:text-[18px]">
                Jaji Electronics
              </span>
            </div>
          </Link>

          {/* =====================================================
              DESKTOP SEARCH
          ====================================================== */}
          <div className="hidden min-w-0 flex-1 justify-center md:flex">
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

          {/* =====================================================
              ACTIONS
          ====================================================== */}
          <div className="ml-auto flex shrink-0 items-center gap-1.5 md:gap-2">

        
          
            {/* MOBILE SEARCH ICON */}
            <button
              type="button"
              aria-label="Search"
              onClick={() => {
                const input = document.getElementById(
                  "mobile-search"
                ) as HTMLInputElement | null;

                input?.focus();
              }}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--dark)] transition-colors hover:bg-[var(--primary-light)] hover:text-[var(--primary)] md:hidden"
            >
              <Search className="h-5 w-5" />
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
                  <span className="absolute -right-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[var(--primary)] px-1 text-[10px] font-bold leading-none text-white">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>

              {cartMessage && (
  <div className="motion-dropdown is-open absolute right-0 top-12 z-[100] whitespace-nowrap rounded-lg bg-[var(--dark)] px-3 py-2 text-xs font-semibold text-white shadow-lg">
    {cartMessage}
  </div>
)}
            </div>
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
            <div
              className={`motion-dropdown absolute left-0 top-full z-[100] w-72 overflow-hidden rounded-b-lg border border-[var(--border)] bg-white py-2 shadow-[var(--shadow-lg)] ${
                categoriesOpen ? "is-open" : ""
              }`}
            >
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
             
               <div
                  className={`motion-dropdown absolute right-0 top-full z-[100] w-64 overflow-hidden rounded-b-lg border border-[var(--border)] bg-white shadow-[var(--shadow-lg)] ${
                    brandsOpen ? "is-open" : ""
                  }`}
                >
               
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
          MOBILE NAVIGATION DRAWER
      ====================================================== */}
      {/* Mobile navigation drawer */}
<div
  className={`mobile-nav-shell md:hidden ${
    mobileMenuOpen ? "is-open" : ""
  }`}
>
  {/* Blurred / dimmed page behind drawer */}
  <button
    type="button"
    aria-label="Close menu"
    onClick={closeMobileMenu}
    className="mobile-nav-backdrop"
  />

  {/* Drawer */}
  <aside
    className="mobile-nav-drawer"
    aria-label="Mobile navigation"
  >
    {/* Drawer header */}
    <div className="flex h-16 items-center justify-between border-b border-[var(--border-light)] px-5">
      <Link href="/" onClick={closeMobileMenu} className="shrink-0">
        <Image
          src="/logo.webp"
          alt="Jaji Electronics"
          width={132}
          height={40}
          className="h-9 w-auto object-contain"
        />
      </Link>

      <button
        type="button"
        onClick={closeMobileMenu}
        aria-label="Close menu"
        className="motion-icon-button flex h-10 w-10 items-center justify-center rounded-full text-[var(--dark)] hover:bg-[var(--primary-light)] hover:text-[var(--primary)]"
      >
        <X className="motion-icon h-5 w-5" strokeWidth={2} />
      </button>
    </div>

    {/* Navigation */}
    <nav className="flex-1 overflow-y-auto px-4 py-5">
      <div className="space-y-1">

        {/* Home */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="mobile-nav-link"
        >
          <Home className="h-5 w-5 shrink-0" />
          <span>Home</span>
        </Link>

        {/* Shop All */}
        <Link
          href="/shop"
          onClick={closeMobileMenu}
          className="mobile-nav-link"
        >
          <Store className="h-5 w-5 shrink-0" />
          <span>Shop All</span>
        </Link>

        {/* Shop by Category */}
        <Link
          href="/#shop-by-category"
          onClick={closeMobileMenu}
          className="mobile-nav-link"
        >
          <Grid2X2 className="h-5 w-5 shrink-0" />
          <span>Shop by Category</span>
          <ChevronRight className="ml-auto h-4 w-4" />
        </Link>

        {/* Shop by Brand */}
        <Link
          href="/#shop-by-brand"
          onClick={closeMobileMenu}
          className="mobile-nav-link"
        >
          <Tag className="h-5 w-5 shrink-0" />
          <span>Shop by Brand</span>
          <ChevronRight className="ml-auto h-4 w-4" />
        </Link>
      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-[var(--border-light)]" />

      {/* Contact */}
      <a
  href="tel:03359864000"
  onClick={closeMobileMenu}
  className="flex h-12 items-center gap-3 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold !text-white shadow-sm transition-all duration-200 hover:bg-[var(--primary-hover)]"
>
  <Phone className="h-5 w-5 shrink-0 !text-white" />
  <span className="!text-white">Call Jaji Electronics</span>
</a>

      {/* Trust points */}
      <div className="mt-6 grid grid-cols-3 gap-2 border-t border-[var(--border-light)] pt-5">
        <div className="rounded-xl bg-[var(--background-soft)] px-2 py-3 text-center">
          <p className="text-[11px] font-bold leading-4 text-[var(--dark)]">
            Cash on
          </p>
          <p className="text-[10px] leading-4 text-[var(--text-muted)]">
            Delivery
          </p>
        </div>

        <div className="rounded-xl bg-[var(--background-soft)] px-2 py-3 text-center">
          <p className="text-[11px] font-bold leading-4 text-[var(--dark)]">
            Original
          </p>
          <p className="text-[10px] leading-4 text-[var(--text-muted)]">
            Products
          </p>
        </div>

        <div className="rounded-xl bg-[var(--background-soft)] px-2 py-3 text-center">
          <p className="text-[11px] font-bold leading-4 text-[var(--dark)]">
            Jaji
          </p>
          <p className="text-[10px] leading-4 text-[var(--text-muted)]">
            Support
          </p>
        </div>
      </div>
    </nav>
  </aside>
</div>
    </header>
  );
}