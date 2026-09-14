import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Menu,
  Search,
  ShoppingCart,
  UserRound,
} from "lucide-react";

import { categories } from "@/data/categories";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Main Header */}
      <div className="border-b border-[var(--border-light)]">
        <div className="container-main flex h-20 items-center gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0"
            aria-label="Jaji Electronics home"
          >
            <Image
              src="/images/logo.webp"
              alt="Jaji Electronics"
              width={180}
              height={80}
              className="h-auto w-[150px] object-contain sm:w-[170px]"
              priority
            />
          </Link>

          {/* Search */}
          <div className="hidden flex-1 md:block">
            <form className="relative mx-auto max-w-2xl">
              <label htmlFor="header-search" className="sr-only">
                Search products
              </label>

              <input
                id="header-search"
                type="search"
                placeholder="Search products..."
                className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background-soft)] px-4 pr-12 text-sm outline-none transition focus:border-[var(--primary)] focus:bg-white"
              />

              <button
                type="submit"
                aria-label="Search"
                className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)]"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              aria-label="Account"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--dark)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              <UserRound className="h-5 w-5" />
            </button>

            <button
              type="button"
              aria-label="Wishlist"
              className="hidden h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--dark)] hover:border-[var(--primary)] hover:text-[var(--primary)] sm:flex"
            >
              <Heart className="h-5 w-5" />
            </button>

            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--dark)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>

            <button
              type="button"
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--dark)] hover:border-[var(--primary)] hover:text-[var(--primary)] md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden bg-[var(--navy)] md:block">
        <div className="container-main flex h-12 items-center">
          {/* Category Button */}
          <button
            type="button"
            className="flex h-full items-center gap-2 bg-[var(--primary)] px-5 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
          >
            <Menu className="h-4 w-4" />
            <span>Shop by Category</span>
          </button>

          {/* Category Links */}
          <div className="flex h-full min-w-0 flex-1 items-center overflow-hidden">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="flex h-full shrink-0 items-center px-4 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Phone */}
          <a
            href="tel:03359864000"
            className="hidden shrink-0 px-2 text-sm font-semibold text-white lg:block"
          >
            0335 9864000
          </a>
        </div>
      </nav>

      {/* Mobile Search */}
      <div className="border-b border-[var(--border-light)] bg-white px-4 py-3 md:hidden">
        <form className="relative">
          <label htmlFor="mobile-search" className="sr-only">
            Search products
          </label>

          <input
            id="mobile-search"
            type="search"
            placeholder="Search products..."
            className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background-soft)] px-4 pr-12 text-sm outline-none focus:border-[var(--primary)] focus:bg-white"
          />

          <button
            type="submit"
            aria-label="Search"
            className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)]"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>
      </div>
    </header>
  );
}