import Image from "next/image";
import Link from "next/link"
import {
  Home,
  SprayCan,
  Sofa,
  Leaf,
} from "lucide-react";

const heroItems = [
  {
    icon: Home,
    label: "Home",
    sublabel: "Fragrances",
  },
  {
    icon: SprayCan,
    label: "Cleaning",
    sublabel: "Essentials",
  },
  {
    icon: Sofa,
    label: "Everyday",
    sublabel: "Comfort",
  },
  {
    icon: Leaf,
    label: "A Fresher",
    sublabel: "Living Space",
  },
];

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-white">

      {/* =====================================================
          DESKTOP IMAGE
      ====================================================== */}
      <div className="absolute right-0 top-0 hidden h-[500px] w-[58%] overflow-hidden lg:block">
        <Image
          src="/images/jaji-home-lifestyle.webp"
          alt="Jaji Home lifestyle"
          fill
          priority
          sizes="58vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-white via-white/60 to-transparent" />
      </div>

      {/* =====================================================
          MOBILE IMAGE
      ====================================================== */}
      <div className="relative h-[260px] overflow-hidden sm:h-[340px] lg:hidden">
        <Image
          src="/images/jaji-home-lifestyle.webp"
          alt="Jaji Home lifestyle"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* =====================================================
          HERO CONTENT
      ====================================================== */}
      <div className="container-main relative z-10">

        <div className="flex min-h-0 w-full items-center py-10 sm:py-12 lg:min-h-[500px] lg:w-[48%] lg:py-0">

          <div className="w-full max-w-[540px]">

            {/* LABEL */}
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--primary)] sm:text-xs sm:tracking-[0.34em]">
              Jaji Home
            </p>

            {/* HEADING */}
            <h1 className="mt-3 text-[34px] font-semibold leading-[1.08] tracking-[-0.035em] text-[var(--navy)] sm:mt-4 sm:text-5xl lg:text-[48px]">
              Comfort for every
              <br className="hidden lg:block" />
              corner of your{" "}
              <span className="text-[var(--primary)]">
                home
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-4 max-w-[480px] text-sm leading-6 text-slate-600 sm:mt-5 sm:text-base">
              Discover home essentials for a fresher, cleaner
              and more comfortable lifestyle.
            </p>

            {/* CTA */}
            <button
              type="button"
              disabled
              className="mt-5 inline-flex items-center gap-2 border-b-2 border-[var(--primary)] pb-1.5 text-sm font-semibold text-[var(--navy)] disabled:cursor-default disabled:opacity-100 sm:mt-6"
            >
             <Link
  href="/shop"
  style={{ color: "#ffffff" }}
  className="inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--primary)] px-5 text-sm font-semibold !text-white transition-colors hover:bg-[var(--primary-hover)]"
>
  <span style={{ color: "#ffffff" }}>Explore Jaji Home</span>
  <span aria-hidden="true" style={{ color: "#ffffff" }}>→</span>
</Link>
            
            </button>



            {/* FEATURES */}
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 sm:mt-10 sm:flex sm:items-stretch sm:gap-0">

              {heroItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2.5 ${
                      index !== 0
                        ? "border-slate-200 sm:border-l sm:pl-4 sm:ml-4"
                        : ""
                    } ${
                      index > 1
                        ? "border-t pt-5 sm:border-t-0 sm:pt-0"
                        : ""
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0 text-[var(--navy)] sm:h-6 sm:w-6" />

                    <div>
                      <p className="text-xs font-semibold leading-4 text-[var(--navy)]">
                        {item.label}
                      </p>

                      <p className="text-xs leading-4 text-slate-500">
                        {item.sublabel}
                      </p>
                    </div>
                  </div>
                );
              })}

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}