
import type { Product } from "@/types/product";

/**
 * Extracts the Cloudinary public ID from URLs returned by our upload API.
 * Only accepts assets inside Jaji Electronics' product image folder.
 */
export function getCloudinaryPublicId(url: string): string | null {
  try {
    const parsed = new URL(url);

    if (!parsed.hostname.endsWith("cloudinary.com")) {
      return null;
    }

    const marker = "/image/upload/";
    const markerIndex = parsed.pathname.indexOf(marker);

    if (markerIndex === -1) return null;

    let parts = parsed.pathname
      .slice(markerIndex + marker.length)
      .split("/")
      .filter(Boolean);

    // Ignore an optional Cloudinary version segment.
    const versionIndex = parts.findIndex((part) => /^v\d+$/.test(part));

    if (versionIndex >= 0) {
      parts = parts.slice(versionIndex + 1);
    }

    if (parts.length === 0) return null;

    // Our uploader creates direct URLs without transformation segments.
    const lastIndex = parts.length - 1;
    parts[lastIndex] = parts[lastIndex].replace(/\.[^.]+$/, "");

    const publicId = parts.join("/");

    if (!publicId.startsWith("jaji-electronics/products/")) {
      return null;
    }

    return publicId;
  } catch {
    return null;
  }
}

/**
 * Collect unique Cloudinary product-image IDs from a product.
 */
export function getProductCloudinaryPublicIds(
  product: Product | null | undefined,
): string[] {
  if (!product) return [];

  const urls = [
    product.image,
    ...(product.images ?? []),
    ...(product.variants ?? []).map((variant) => variant.image ?? ""),
    ...(product.colors ?? []).flatMap((color) => color.images ?? []),
  ];

  return [
    ...new Set(
      urls
        .map((url) => getCloudinaryPublicId(url))
        .filter((id): id is string => id !== null),
    ),
  ];
}
