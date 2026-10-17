import "server-only";

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { products as localProducts } from "@/data/products";
import type { Product } from "@/types/product";

export const runtime = "nodejs";

const COLLECTION = "productCatalog";
const SLUG_COLLECTION = "productSlugRegistry";

const PRODUCT_FIELDS = [
  "name",
  "slug",
  "features",
  "faqs",
  "categoryId",
  "brandId",
  "price",
  "priceMax",
  "image",
  "images",
  "description",
  "specifications",
  "variants",
  "colors",
  "model",
] as const;

type AuthResult =
  | { uid: string }
  | { response: Response };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

class ProductIdCollisionError extends Error {}
class ProductSlugCollisionError extends Error {}

async function authorizeAdmin(request: Request): Promise<AuthResult> {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;

  if (!token) {
    return {
      response: NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      ),
    };
  }

  let uid: string;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    uid = decoded.uid;
  } catch {
    return {
      response: NextResponse.json(
        { error: "Invalid or expired authentication token." },
        { status: 401 },
      ),
    };
  }

  const adminDoc = await adminDb.collection("admins").doc(uid).get();

  if (!adminDoc.exists || adminDoc.data()?.role !== "admin") {
    return {
      response: NextResponse.json(
        { error: "Admin access required." },
        { status: 403 },
      ),
    };
  }

  return { uid };
}

/**
 * Converts a product name into a URL-safe identifier.
 * This is used by the server, not controlled by the admin form.
 */
function slugify(value: string): string {
  const result = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)
    .replace(/-+$/g, "");

  return result || "product";
}

function withSuffix(base: string, suffix: number): string {
  return suffix === 1 ? base : `${base}-${suffix}`;
}

/**
 * For creation, ignore the client-supplied ID and slug.
 * For updates, require the product ID to locate the existing record.
 * The saved slug is always recovered from the existing server record.
 */
function normalizeProduct(
  value: unknown,
  requireId: boolean,
): Product | null {
  if (!isRecord(value)) return null;

  const { id, name, categoryId, brandId, price, image } = value;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof categoryId !== "string" ||
    !categoryId.trim() ||
    typeof brandId !== "string" ||
    !brandId.trim() ||
    typeof price !== "number" ||
    !Number.isFinite(price) ||
    price < 0 ||
    typeof image !== "string" ||
    !image.trim()
  ) {
    return null;
  }

  if (
    requireId &&
    (
      typeof id !== "string" ||
      !id.trim() ||
      id.trim().length > 150 ||
      id.includes("/")
    )
  ) {
    return null;
  }

  if (
    value.priceMax !== undefined &&
    (
      typeof value.priceMax !== "number" ||
      !Number.isFinite(value.priceMax) ||
      value.priceMax < price
    )
  ) {
    return null;
  }

  if (
    value.features !== undefined &&
    (
      !Array.isArray(value.features) ||
      !value.features.every((item) => typeof item === "string")
    )
  ) {
    return null;
  }

  if (
    value.images !== undefined &&
    (
      !Array.isArray(value.images) ||
      !value.images.every((item) => typeof item === "string")
    )
  ) {
    return null;
  }

  if (
    value.faqs !== undefined &&
    (
      !Array.isArray(value.faqs) ||
      !value.faqs.every(
        (item) =>
          isRecord(item) &&
          typeof item.question === "string" &&
          typeof item.answer === "string",
      )
    )
  ) {
    return null;
  }

  if (
    value.specifications !== undefined &&
    (
      !isRecord(value.specifications) ||
      !Object.values(value.specifications).every(
        (item) => typeof item === "string",
      )
    )
  ) {
    return null;
  }

  const product: Record<string, unknown> = {
    id: requireId ? (id as string).trim() : "",
    name: name.trim(),
    slug: "",
    categoryId: categoryId.trim(),
    brandId: brandId.trim(),
    price,
    image: image.trim(),
  };

  for (const field of PRODUCT_FIELDS) {
    if (
      field in value &&
      ![
        "name",
        "slug",
        "categoryId",
        "brandId",
        "price",
        "image",
      ].includes(field)
    ) {
      product[field] = value[field];
    }
  }

  return product as unknown as Product;
}

function hasRequiredFields(
  value: Record<string, unknown>,
): boolean {
  return (
    typeof value.name === "string" &&
    !!value.name.trim() &&
    typeof value.slug === "string" &&
    !!value.slug.trim() &&
    typeof value.categoryId === "string" &&
    !!value.categoryId.trim() &&
    typeof value.brandId === "string" &&
    !!value.brandId.trim() &&
    typeof value.price === "number" &&
    Number.isFinite(value.price) &&
    value.price >= 0 &&
    typeof value.image === "string" &&
    !!value.image.trim()
  );
}

async function loadMergedProducts(): Promise<Product[]> {
  const snapshot = await adminDb.collection(COLLECTION).get();
  const merged = new Map<string, Product>();

  // Preserve the existing static catalogue.
  for (const product of localProducts) {
    merged.set(product.id, product);
  }

  // Apply Firestore edits and additions, respecting soft deletions.
  for (const item of snapshot.docs) {
    const record = item.data();

    if (record.deleted === true) {
      merged.delete(item.id);
      continue;
    }

    const fields: Record<string, unknown> = {};

    for (const field of PRODUCT_FIELDS) {
      if (field in record) {
        fields[field] = record[field];
      }
    }

    const existing = merged.get(item.id);

    const candidate = {
      ...(existing ?? {}),
      ...fields,
      id: item.id,
    } as Product;

    if (
      !hasRequiredFields(
        candidate as unknown as Record<string, unknown>,
      )
    ) {
      continue;
    }

    merged.set(item.id, candidate);
  }

  return Array.from(merged.values());
}

/**
 * Create a product using a server-generated ID and unique slug.
 *
 * Slugs are reserved transactionally so two simultaneous requests
 * cannot claim the same new slug.
 */
async function createProductWithUniqueIdentity(
  draft: Product,
): Promise<Product> {
  const [currentProducts, savedDocuments] = await Promise.all([
    loadMergedProducts(),
    adminDb.collection(COLLECTION).get(),
  ]);

  const usedIds = new Set<string>([
    ...localProducts.map((product) => product.id),
    ...savedDocuments.docs.map((document) => document.id),
  ]);

  const usedSlugs = new Set<string>(
    currentProducts.map((product) => product.slug.toLowerCase()),
  );

  const base = slugify(draft.name);

  let idSuffix = 1;
  let slugSuffix = 1;

  for (let attempt = 0; attempt < 1000; attempt++) {
    let id = withSuffix(base, idSuffix);

    while (usedIds.has(id)) {
      idSuffix++;
      id = withSuffix(base, idSuffix);
    }

    let slug = withSuffix(base, slugSuffix);

    while (usedSlugs.has(slug.toLowerCase())) {
      slugSuffix++;
      slug = withSuffix(base, slugSuffix);
    }

    const productRef = adminDb.collection(COLLECTION).doc(id);
    const slugRef = adminDb.collection(SLUG_COLLECTION).doc(slug);
    const overrideRef = adminDb.collection("productOverrides").doc(id);

    let savedProduct: Product | undefined;

    try {
      await adminDb.runTransaction(async (transaction) => {
        const existingId = await transaction.get(productRef);
        const existingSlug = await transaction.get(slugRef);

        if (existingId.exists) {
          throw new ProductIdCollisionError();
        }

        if (existingSlug.exists) {
          throw new ProductSlugCollisionError();
        }

        savedProduct = {
          ...draft,
          id,
          slug,
        };

        transaction.set(productRef, {
          ...savedProduct,
          deleted: false,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });

        transaction.set(slugRef, {
          productId: id,
          slug,
          createdAt: FieldValue.serverTimestamp(),
        });

        transaction.set(
          overrideRef,
          { price: draft.price },
          { merge: true },
        );
      });

      if (!savedProduct) {
        throw new Error("The product was not created.");
      }

      return savedProduct;
    } catch (error) {
      if (error instanceof ProductIdCollisionError) {
        usedIds.add(id);
        idSuffix++;
        continue;
      }

      if (error instanceof ProductSlugCollisionError) {
        usedSlugs.add(slug.toLowerCase());
        slugSuffix++;
        continue;
      }

      throw error;
    }
  }

  throw new Error("Could not generate a unique product ID and URL.");
}

/**
 * GET: list the merged catalogue.
 */
export async function GET(request: Request) {
  try {
    const auth = await authorizeAdmin(request);
    if ("response" in auth) return auth.response;

    const products = await loadMergedProducts();

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Could not load admin products:", error);

    return NextResponse.json(
      { error: "Could not load products." },
      { status: 500 },
    );
  }
}

/**
 * POST: create a product.
 * The server generates its permanent ID and URL slug.
 */
export async function POST(request: Request) {
  try {
    const auth = await authorizeAdmin(request);
    if ("response" in auth) return auth.response;

    const draft = normalizeProduct(await request.json(), false);

    if (!draft) {
      return NextResponse.json(
        { error: "Product information is invalid or incomplete." },
        { status: 400 },
      );
    }

    const product = await createProductWithUniqueIdentity(draft);

    return NextResponse.json(
      { success: true, product },
      { status: 201 },
    );
  } catch (error) {
    console.error("Could not create product:", error);

    return NextResponse.json(
      { error: "Could not create product." },
      { status: 500 },
    );
  }
}

/**
 * PUT: update an existing product.
 * The original ID and slug are always preserved.
 */
export async function PUT(request: Request) {
  try {
    const auth = await authorizeAdmin(request);
    if ("response" in auth) return auth.response;

    const submitted = normalizeProduct(await request.json(), true);

    if (!submitted) {
      return NextResponse.json(
        { error: "Product information is invalid or incomplete." },
        { status: 400 },
      );
    }

    const products = await loadMergedProducts();

    const existingProduct = products.find(
      (product) => product.id === submitted.id,
    );

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 },
      );
    }

    // Do not trust a client-supplied ID or slug as mutable product data.
    const product: Product = {
      ...submitted,
      id: existingProduct.id,
      slug: existingProduct.slug,
    };

    const ref = adminDb.collection(COLLECTION).doc(product.id);
    const existingDoc = await ref.get();

    const batch = adminDb.batch();

    batch.set(ref, {
      ...product,
      deleted: false,
      createdAt:
        existingDoc.data()?.createdAt ?? FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    batch.set(
      adminDb.collection("productOverrides").doc(product.id),
      { price: product.price },
      { merge: true },
    );

    await batch.commit();

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Could not update product:", error);

    return NextResponse.json(
      { error: "Could not update product." },
      { status: 500 },
    );
  }
}

/**
 * DELETE: soft-delete a product.
 */
export async function DELETE(request: Request) {
  try {
    const auth = await authorizeAdmin(request);
    if ("response" in auth) return auth.response;

    const body: unknown = await request.json();

    if (
      !isRecord(body) ||
      typeof body.id !== "string" ||
      !body.id.trim() ||
      body.id.includes("/")
    ) {
      return NextResponse.json(
        { error: "A valid product ID is required." },
        { status: 400 },
      );
    }

    const id = body.id.trim();
    const products = await loadMergedProducts();

    if (!products.some((product) => product.id === id)) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 },
      );
    }

    await adminDb.collection(COLLECTION).doc(id).set(
      {
        id,
        deleted: true,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Could not delete product:", error);

    return NextResponse.json(
      { error: "Could not delete product." },
      { status: 500 },
    );
  }
}

