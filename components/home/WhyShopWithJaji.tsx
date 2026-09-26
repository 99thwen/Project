import {
  BadgeCheck,
  Banknote,
  MessageCircle,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";

const benefits = [
  {
    icon: BadgeCheck,
    title: "100% Genuine Products",
    description:
      "Every appliance is original and sourced from authorized dealers. No copies, no refurbished units sold as new.",
  },
  {
    icon: ShieldCheck,
    title: "Official Brand Warranty",
    description:
      "Your purchase is covered by the manufacturer's warranty, and we help you claim it if anything goes wrong.",
  },
  {
    icon: Banknote,
    title: "Cash on Delivery",
    description:
      "Order online and pay when your appliance arrives. Check it at your door before paying.",
  },
  {
    icon: Truck,
    title: "Local Expertise",
    description:
      "Get practical guidance from a local team that understands the needs of customers in Peshawar.",
  },
  {
    icon: Wrench,
    title: "Installation Support",
    description:
      "Need your AC or geyser installed? Our team can arrange installation after delivery.",
  },
  {
    icon: MessageCircle,
    title: "Product Guidance",
    description:
      "Not sure which appliance is right for you? We can help you understand your options before you buy.",
  },
];

export default function WhyShopWithJaji() {
  return (
    <section className="bg-[var(--navy)] py-14 sm:py-16 lg:py-20">
      <div className="container-main">
        {/* Section heading */}
        <div className="mb-10 max-w-2xl sm:mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
            Why Shop With Jaji
          </p>

          <h2 className="mt-2 !text-2xl !font-semibold !leading-tight !tracking-tight !text-white sm:!text-3xl lg:!text-[34px]">
            Buy with confidence
          </h2>

          <p className="mt-3 !text-sm !leading-6 !text-blue-100/80">
            Genuine appliances, honest prices, and real support from a local
            Peshawar shop.
          </p>
        </div>

        {/* Benefits: the 1px gap shows the wrapper's color as divider lines */}
        <div className="grid grid-cols-1 gap-px bg-white/15 sm:-mx-6 sm:grid-cols-2 lg:-mx-8 lg:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="flex gap-4 bg-[var(--navy)] py-6 sm:px-6 lg:p-8"
              >
                {/* Icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
                  <Icon className="h-[18px] w-[18px]" />
                </div>

                {/* Text */}
                <div>
                  <h3 className="!text-sm !font-semibold !leading-5 !text-white">
                    {benefit.title}
                  </h3>

                  <p className="mt-1 max-w-[280px] !text-xs !leading-5 !text-blue-100/80">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}