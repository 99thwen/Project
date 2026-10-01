import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import CartProvider from "@/components/cart/CartProvider";

import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Jaji Electronics | Home Appliances & Electronics",
    template: "%s | Jaji Electronics",
  },

  description:
    "Shop home appliances and electronics at Jaji Electronics. Explore air conditioners, refrigerators, washing machines, deep freezers, microwaves and more.",

  keywords: [
    "Jaji Electronics",
    "home appliances Pakistan",
    "electronics Pakistan",
    "air conditioners Pakistan",
    "refrigerators Pakistan",
    "washing machines Pakistan",
    "deep freezers Pakistan",
    "microwave ovens Pakistan",
    "Haier appliances",
    "Orient appliances",
    "Dawlance appliances",
    "PEL appliances",
    "Gree appliances",
  ],

  authors: [
    {
      name: "Jaji Electronics",
    },
  ],

  creator: "Jaji Electronics",
  publisher: "Jaji Electronics",

  applicationName: "Jaji Electronics",

  category: "shopping",

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },

  openGraph: {
    type: "website",
    locale: "en_PK",
    url: siteUrl,
    siteName: "Jaji Electronics",
    title: "Jaji Electronics | Home Appliances & Electronics",
    description:
      "Shop home appliances and electronics at Jaji Electronics.",
    images: [
      {
        url: "/logo.webp",
        width: 1200,
        height: 630,
        alt: "Jaji Electronics",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Jaji Electronics | Home Appliances & Electronics",
    description:
      "Shop home appliances and electronics at Jaji Electronics.",
    images: ["/logo.webp"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}