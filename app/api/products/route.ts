import { NextResponse } from "next/server";
import { getStoreProducts } from "@/lib/serverProducts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getStoreProducts();

    return NextResponse.json(
      { products },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error("Could not load storefront products:", error);

    return NextResponse.json(
      { error: "Could not load products." },
      { status: 500 },
    );
  }
}