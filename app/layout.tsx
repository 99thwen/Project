import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import CartProvider from "@/components/cart/CartProvider";

import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Electronics Store",
  description: "Online store for home appliances and electronics.",
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