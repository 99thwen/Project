
import "server-only";

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { products as localProducts } from "@/data/products";

export const runtime = "nodejs";

const ALLOWED_FOLDER = "jaji-electronics/products/";

function containsPublicId(value: unknown, publicId: string): boolean {
  if (typeof value === "string") {
    return value.includes(publicId);
  }

  if (Array.isArray(value)) {
    return value.some((item) => containsPublicId(item, publicId));
  }

  if (typeof value === "object" && value !== null) {
    return Object.values(value).some((item) =>
      containsPublicId(item, publicId),
    );
  }

  return false;
}

export async function DELETE(request: Request) {
  try {
    // 1. Verify the signed-in user
    const authorization = request.headers.get("authorization");
    const token = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    let uid: string;

    try {
      const decoded = await adminAuth.verifyIdToken(token);
      uid = decoded.uid;
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired authentication token." },
        { status: 401 },
      );
    }

    // 2. Verify admin role
    const adminDoc = await adminDb.collection("admins").doc(uid).get();

    if (!adminDoc.exists || adminDoc.data()?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 },
      );
    }

    // 3. Validate requested image IDs
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("publicIds" in body) ||
      !Array.isArray(body.publicIds) ||
      body.publicIds.length === 0 ||
      body.publicIds.length > 50 ||
      !body.publicIds.every(
        (id: unknown) =>
          typeof id === "string" &&
          id.startsWith(ALLOWED_FOLDER) &&
          !id.includes("..") &&
          id.length <= 500,
      )
    ) {
      return NextResponse.json(
        { error: "A list of valid Jaji Electronics image IDs is required." },
        { status: 400 },
      );
    }

    const publicIds = [...new Set(body.publicIds as string[])];

    // 4. Validate Cloudinary configuration
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Image storage is not configured." },
        { status: 500 },
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    // 5. Check existing catalogue references
    const snapshot = await adminDb.collection("productCatalog").get();

    const deleted: string[] = [];
    const skipped: string[] = [];
    const failed: string[] = [];

    for (const publicId of publicIds) {
        const isReferenced =
  localProducts.some((product) =>
    containsPublicId(product, publicId),
  ) ||
  snapshot.docs.some((doc) => {
    const data = doc.data();

    if (data.deleted === true) return false;

    return containsPublicId(data, publicId);
  });



      if (isReferenced) {
        skipped.push(publicId);
        continue;
      }

      try {
        const result = await cloudinary.uploader.destroy(publicId, {
          resource_type: "image",
          invalidate: true,
        });

        if (result.result === "ok" || result.result === "not found") {
          deleted.push(publicId);
        } else {
          failed.push(publicId);
        }
      } catch {
        failed.push(publicId);
      }
    }

    return NextResponse.json({
      success: failed.length === 0,
      deleted,
      skipped,
      failed,
    });
  } catch (error) {
    console.error("Cloudinary cleanup failed:", error);

    return NextResponse.json(
      { error: "Could not clean up unused images." },
      { status: 500 },
    );
  }
}
