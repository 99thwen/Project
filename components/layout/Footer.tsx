import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--navy)] text-white">
      <div className="container-main py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Business */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">
              Jaji Electronics
            </h2>

            <p className="max-w-xs text-sm leading-7 text-white/75">
              Your electronics and home-appliances store.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-white">
              Contact
            </h3>

            <div className="space-y-4 text-sm text-white/75">
              <a
                href="tel:03359864000"
                className="flex items-start gap-3 hover:text-[var(--primary)]"
              >
                <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                <span>0335 9864000</span>
              </a>

              <a
                href="mailto:jajielectronics97@gmail.com"
                className="flex items-start gap-3 break-all hover:text-[var(--primary)]"
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                <span>jajielectronics97@gmail.com</span>
              </a>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Shaheen Market, Karkhano,
                  <br />
                  Peshawar, Pakistan, 25000
                </span>
              </div>
            </div>
          </div>

          {/* Store */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-white">
              Store
            </h3>

            <ul className="space-y-3 text-sm text-white/75">
              <li>
                <a
                  href="/shop"
                  className="hover:text-[var(--primary)]"
                >
                  Shop
                </a>
              </li>

              <li>
                <a
                  href="/cart"
                  className="hover:text-[var(--primary)]"
                >
                  Cart
                </a>
              </li>

              <li>
                <a
                  href="/checkout"
                  className="hover:text-[var(--primary)]"
                >
                  Checkout
                </a>
              </li>
            </ul>
          </div>

          {/* Payment */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-white">
              Payment
            </h3>

            <p className="text-sm leading-6 text-white/75">
              Cash on Delivery
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-main py-5">
          <p className="text-center text-xs text-white/60">
            © {new Date().getFullYear()} Jaji Electronics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}