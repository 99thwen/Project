
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // 1. Verify authentication
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
    const adminDoc = await adminDb
      .collection("admins")
      .doc(uid)
      .get();

    if (!adminDoc.exists || adminDoc.data()?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 },
      );
    }

    // 3. Validate Cloudinary configuration
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("Cloudinary environment variables are missing.");

      return NextResponse.json(
        { error: "Image storage is not configured correctly." },
        { status: 500 },
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    // 4. Validate uploaded image
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please provide an image file." },
        { status: 400 },
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Use a JPG, PNG, WebP, or AVIF image." },
        { status: 400 },
      );
    }

    const maxBytes = 5 * 1024 * 1024;

    if (file.size === 0 || file.size > maxBytes) {
      return NextResponse.json(
        { error: "Image must be smaller than 5 MB." },
        { status: 400 },
      );
    }

    // 5. Upload to Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "jaji-electronics/products",
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
        },
        (error, uploaded) => {
          if (error || !uploaded) {
            reject(error ?? new Error("Image upload failed."));
          } else {
            resolve({
              secure_url: uploaded.secure_url,
              public_id: uploaded.public_id,
            });
          }
        },
      );

      stream.end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Product image upload failed:", error);

    return NextResponse.json(
      { error: "Image upload failed. Check server configuration." },
      { status: 500 },
    );
  }
}
