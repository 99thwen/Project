"use client";

import Image from "next/image";
import Link from "next/link";

import {

  Mail,
  MapPin,
  MessageCircle,
  Phone,
  
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";

import { categories } from "@/data/categories";

export default function Footer() {
  return (
    <footer className="bg-[var(--dark)] !text-white">
      

      {/* Main Footer */}
      <section className="border-t border-white/10">
        <div className="container-main py-10">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.25fr_1fr_0.8fr_1.35fr]">
            
            {/* Company */}
            <div>
              <Link href="/" className="inline-block">
                <Image
                  src="/logo.webp"
                  alt="Jaji Electronics"
                  width={180}
                  height={80}
                  className="h-24 w-auto object-contain"
                />
              </Link>

              <div className="mt-5 space-y-4 text-sm !text-white/70">
                <a
                  href="tel:03359864000"
                  className="flex items-center gap-3 !text-white/70 hover:!text-white"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>0335 9864000</span>
                </a>

                <a
                  href="mailto:jajielectronics97@gmail.com"
                  className="flex items-center gap-3 !text-white/70 hover:!text-white"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>jajielectronics97@gmail.com</span>
                </a>

                <div className="flex items-start gap-3 !text-white/70">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />

                  <span>
                    Shaheen Market, Karkhano,
                    <br />
                    Peshawar, Pakistan
                  </span>
                </div>
              </div>
            </div>

            {/* Shop */}
            <div>
              <h3 className="!text-white text-sm font-bold uppercase tracking-wide">
                Shop
              </h3>

              <div className="mt-5 space-y-2.5 text-sm">
                {categories.slice(0, 9).map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="block !text-white/70 hover:!text-white"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Useful Links */}
{/* Useful Links */}
<div>
  <h3 className="!text-white text-sm font-bold uppercase tracking-wide">
    Useful Links
  </h3>

  <div className="mt-5 space-y-2.5 text-sm">
    <Link
      href="/"
      className="block !text-white/70 hover:!text-white"
    >
      Home
    </Link>

    <Link
      href="/cart"
      className="block !text-white/70 hover:!text-white"
    >
      Shopping Cart
    </Link>


    <Link
      href="/privacy-policy"
      className="block !text-white/70 hover:!text-white"
    >
      Privacy Policy
    </Link>

    <Link
      href="/terms-and-conditions"
      className="block !text-white/70 hover:!text-white"
    >
      Terms &amp; Conditions
    </Link>

    <Link
      href="/return-refund-policy"
      className="block !text-white/70 hover:!text-white"
    >
      Return &amp; Refund Policy
    </Link>
  </div>
</div>



            {/* Follow Us */}
{/* Follow Us */}
<div>
  <h3 className="!text-white text-sm font-semibold uppercase tracking-wide">
    Follow Us
  </h3>

  <p className="mt-5 text-sm leading-6 !text-white/70">
    Stay connected with Jaji Electronics for new products, offers, and
    updates.
  </p>

  <div className="mt-6 flex gap-3">
    <a
  href="https://www.facebook.com/p/Jaji-Electronics-61593231897988/"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Facebook"
  className="flex h-9 w-9 items-center justify-center rounded-full bg-white !text-[#222222] transition-opacity hover:opacity-80"
>
      <FaFacebookF className="h-4 w-4" />
    </a>

    <a
  href="https://www.instagram.com/jajielectronics/"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Instagram"
  className="flex h-9 w-9 items-center justify-center rounded-full bg-white !text-[#222222] transition-opacity hover:opacity-80"
>
  <FaInstagram className="h-4 w-4" />
</a>

    <a
      href="#"
      aria-label="YouTube"
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white !text-[#222222] transition-opacity hover:opacity-80"
    >
      <FaYoutube className="h-4 w-4" />
    </a>

    <a
      href="#"
      aria-label="TikTok"
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white !text-[#222222] transition-opacity hover:opacity-80"
    >
      <FaTiktok className="h-4 w-4" />
    </a>
  </div>
</div>
          </div>
        </div>
      </section>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-main flex flex-col gap-2 py-4 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="!text-white/50">
            © {new Date().getFullYear()} Jaji Electronics. All Rights
            Reserved.
          </p>

          <p className="!text-white/50">
            Cash on Delivery • Peshawar, Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}