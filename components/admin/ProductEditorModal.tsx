"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  GripVertical,
  ImagePlus,
  Package,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import type {
  Product,
  ProductColor,
  ProductVariant,
} from "@/types/product";
import { getProductCloudinaryPublicIds } from "@/lib/cloudinaryAssets";

type Option = {
  id: string;
  name: string;
  slug?: string;
};

type Props = {
  open: boolean;
  initialProduct: Product | null;
  categories: Option[];
  brands: Option[];
  saving: boolean;
  onClose: () => void;
 onSave: (product: Product) => Promise<Product | void>;

  onDelete: (product: Product) => Promise<void>;
};

type ProductTab =
  | "details"
  | "images"
  | "features"
  | "specifications"
  | "faqs"
  | "variants"
  | "colors";

type SpecRow = {
  key: string;
  value: string;
};

type UploadedAsset = {
  url: string;
  publicId: string;
};

type UploadDestination =
  | { type: "main" }
  | { type: "additional" }
  | { type: "variant"; index: number }
  | { type: "color"; index: number };

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const tabs: { id: ProductTab; label: string }[] = [
  { id: "details", label: "Basic Details" },
  { id: "images", label: "Images" },
  { id: "features", label: "Features" },
  { id: "specifications", label: "Specifications" },
  { id: "faqs", label: "FAQs" },
  { id: "variants", label: "Variants" },
  { id: "colors", label: "Colors" },
];

const emptyProduct = (
  categories: Option[],
  brands: Option[],
): Product => ({
  id: "",
  name: "",
  slug: "",
  categoryId: categories[0]?.id ?? "",
  brandId: brands[0]?.id ?? "",
  price: 0,
  image: "",
  description: "",
  features: [],
  images: [],
  specifications: {},
  faqs: [],
  variants: [],
  colors: [],
});

function cloneProduct(product: Product): Product {
  return {
    ...product,
    features: [...(product.features ?? [])],
    images: [...(product.images ?? [])],
    specifications: { ...(product.specifications ?? {}) },
    faqs: (product.faqs ?? []).map((faq) => ({ ...faq })),
    variants: (product.variants ?? []).map((variant) => ({
      ...variant,
      specifications: { ...(variant.specifications ?? {}) },
    })),
    colors: (product.colors ?? []).map((color) => ({
      ...color,
      images: [...(color.images ?? [])],
    })),
  };
}

function SpecificationFields({
  value,
  onChange,
  disabled = false,
}: {
  value?: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  disabled?: boolean;
}) {
  const [rows, setRows] = useState<SpecRow[]>(() =>
    Object.entries(value ?? {}).map(([key, val]) => ({ key, value: val })),
  );

  function changeRows(next: SpecRow[]) {
    setRows(next);
    onChange(
      Object.fromEntries(
        next
          .filter((row) => row.key.trim())
          .map((row) => [row.key.trim(), row.value.trim()]),
      ),
    );
  }

  const activeCount = rows.filter((row) => row.key.trim()).length;
  const specInputClass =
    "w-full min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-normal text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-500">
          Add details such as capacity, dimensions, type, or energy rating.
        </p>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {activeCount} specifications
        </span>
      </div>

      {rows.length > 0 && (
        <div className="mb-2 hidden grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_40px] gap-3 px-2 sm:grid">
          <span className="text-xs font-medium text-gray-500">Specification</span>
          <span className="text-xs font-medium text-gray-500">Value</span>
          <span />
        </div>
      )}

      <div className="space-y-2.5">
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid min-w-0 grid-cols-1 items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 transition-colors hover:border-gray-300 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_40px] sm:gap-3 sm:p-2"
          >
            <label className="min-w-0">
              <span className="mb-1 block text-xs text-gray-500 sm:hidden">
                Specification name
              </span>
              <input
                aria-label={`Specification name ${index + 1}`}
                placeholder="e.g. Cooling Capacity"
                className={specInputClass}
                value={row.key}
                disabled={disabled}
                onChange={(event) =>
                  changeRows(
                    rows.map((item, i) =>
                      i === index ? { ...item, key: event.target.value } : item,
                    ),
                  )
                }
              />
            </label>

            <label className="min-w-0">
              <span className="mb-1 block text-xs text-gray-500 sm:hidden">
                Value
              </span>
              <input
                aria-label={`Specification value ${index + 1}`}
                placeholder="e.g. 1.5 Ton"
                className={specInputClass}
                value={row.value}
                disabled={disabled}
                onChange={(event) =>
                  changeRows(
                    rows.map((item, i) =>
                      i === index ? { ...item, value: event.target.value } : item,
                    ),
                  )
                }
              />
            </label>

            <button
              type="button"
              aria-label={`Remove specification ${index + 1}`}
              title="Remove specification"
              disabled={disabled}
              onClick={() => changeRows(rows.filter((_, i) => i !== index))}
              className="flex h-10 w-full items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {rows.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/70 px-4 py-9 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400">
            <ImagePlus className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm font-medium text-gray-700">
            No specifications added yet
          </p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-gray-500">
            Add technical details to help customers understand your product.
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
        <p className="text-xs text-gray-500">Add each detail as a name and value.</p>
        <button
          type="button"
          disabled={disabled}
          onClick={() => changeRows([...rows, { key: "", value: "" }])}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add Specification
        </button>
      </div>
    </div>
  );
}

export default function ProductEditorModal({
  open,
  initialProduct,
  categories,
  brands,
  saving,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [form, setForm] = useState<Product>(() => emptyProduct(categories, brands));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [sessionUploads, setSessionUploads] = useState<UploadedAsset[]>([]);
  const [productSaved, setProductSaved] = useState(false);
  const [pendingCleanupIds, setPendingCleanupIds] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [activeTab, setActiveTab] = useState<ProductTab>("details");
  const contentRef = useRef<HTMLDivElement>(null);

  const isBusy = saving || uploading || deleting;

  useEffect(() => {
    if (!open) return;
    setActiveTab("details");
    setSessionUploads([]);
    setProductSaved(false);
    setPendingCleanupIds([]);
    setDeleteConfirmOpen(false);
    setDeleting(false);
    setDeleteError("");
    setForm(initialProduct ? cloneProduct(initialProduct) : emptyProduct(categories, brands));
    setError("");
  }, [open, initialProduct, categories, brands]);

  if (!open) return null;

  function update<K extends keyof Product>(key: K, value: Product[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateVariant(index: number, patch: Partial<ProductVariant>) {
    setForm((current) => ({
      ...current,
      variants: (current.variants ?? []).map((variant, i) =>
        i === index ? { ...variant, ...patch } : variant,
      ),
    }));
  }

  function updateColor(index: number, patch: Partial<ProductColor>) {
    setForm((current) => ({
      ...current,
      colors: (current.colors ?? []).map((color, i) =>
        i === index ? { ...color, ...patch } : color,
      ),
    }));
  }

  function switchTab(tab: ProductTab) {
    setActiveTab(tab);
    setError("");
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }

  async function uploadToCloudinary(file: File): Promise<UploadedAsset> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Your session has expired. Please sign in again.");
    }
    const token = await user.getIdToken();
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body,
    });

    let result: { error?: string; url?: string; publicId?: string };
    try {
      result = await response.json();
    } catch {
      throw new Error("The image upload returned an unreadable response.");
    }
    if (!response.ok) throw new Error(result.error ?? "Image upload failed.");
    if (typeof result.url !== "string" || typeof result.publicId !== "string") {
      throw new Error("The upload response is missing image information.");
    }
    return { url: result.url, publicId: result.publicId };
  }

  async function handleImageUpload(files: File[], destination: UploadDestination) {
    if (!files.length || isBusy || productSaved) return;

    const invalidType = files.find((file) => !IMAGE_TYPES.has(file.type));
    if (invalidType) {
      setError("Use JPG, PNG, WebP, or AVIF images.");
      return;
    }
    const oversized = files.find((file) => file.size > MAX_IMAGE_BYTES);
    if (oversized) {
      setError("Each image must be 5 MB or smaller.");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const uploaded: UploadedAsset[] = [];
      for (const file of files) {
        const asset = await uploadToCloudinary(file);
        uploaded.push(asset);
        setSessionUploads((current) => [...current, asset]);
      }

      const urls = uploaded.map((asset) => asset.url);
      if (destination.type === "main") {
        update("image", urls[0]);
      } else if (destination.type === "additional") {
        setForm((current) => ({
          ...current,
          images: [...(current.images ?? []), ...urls],
        }));
      } else if (destination.type === "variant") {
        updateVariant(destination.index, { image: urls[0] });
      } else {
        setForm((current) => ({
          ...current,
          colors: (current.colors ?? []).map((color, index) =>
            index === destination.index
              ? { ...color, images: [...(color.images ?? []), ...urls] }
              : color,
          ),
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function cleanupCloudinaryAssets(publicIds: string[]) {
    const uniqueIds = [...new Set(publicIds.filter(Boolean))];
    if (uniqueIds.length === 0) return;

    const user = auth.currentUser;
    if (!user) throw new Error("Please sign in again to clean up unused images.");

    const token = await user.getIdToken();
    const response = await fetch("/api/admin/images", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicIds: uniqueIds }),
    });

    let result: { error?: string; failed?: string[] };
    try {
      result = await response.json();
    } catch {
      throw new Error("Image cleanup returned an unreadable response.");
    }
    if (!response.ok || (result.failed?.length ?? 0) > 0) {
      throw new Error(result.error ?? "Some unused images could not be removed.");
    }
  }

  async function handleCancel() {
    if (isBusy) return;
    const idsToClean = productSaved
      ? pendingCleanupIds
      : sessionUploads.map((asset) => asset.publicId);
    try {
      await cleanupCloudinaryAssets(idsToClean);
      setPendingCleanupIds([]);
      setSessionUploads([]);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not clean up unused images. Please retry.",
      );
    }
  }

  async function confirmDelete() {
    if (!initialProduct || isBusy || productSaved) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await onDelete(initialProduct);
      setDeleteConfirmOpen(false);
      setSessionUploads([]);
      setPendingCleanupIds([]);
      onClose();
      // Best-effort cleanup for images uploaded only during this editing session.
      // Product deletion has already succeeded, so cleanup failure must not imply
      // that the product still exists.
      const newlyUploadedIds = sessionUploads.map((asset) => asset.publicId);
      void cleanupCloudinaryAssets(newlyUploadedIds).catch((cleanupErr) => {
        console.error("Could not clean up temporary product images:", cleanupErr);
      });
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Could not delete this product. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  }

  function showValidationError(message: string, tab: ProductTab) {
    setError(message);
    setActiveTab(tab);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }

  async function submit() {
    setError("");

    if (productSaved) {
      try {
        await cleanupCloudinaryAssets(pendingCleanupIds);
        setPendingCleanupIds([]);
        setSessionUploads([]);
        onClose();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Product was saved, but unused images still need cleanup. Please retry.",
        );
      }
      return;
    }

   const name = form.name.trim();

if (
  !name ||
  !form.categoryId ||
  !form.brandId ||
  !form.image.trim()
) {
  showValidationError(
    "Complete the product name, category, brand, and main image before saving.",
    !form.image.trim() ? "images" : "details",
  );
  return;
}

    if (!Number.isFinite(form.price) || form.price <= 0) {
      showValidationError("Please enter a price greater than zero.", "details");
      return;
    }

    if (
      form.priceMax !== undefined &&
      (!Number.isFinite(form.priceMax) || form.priceMax < form.price)
    ) {
      showValidationError("Maximum price must be at least the base price.", "details");
      return;
    }

    const faqs = (form.faqs ?? []).filter(
      (faq) => faq.question.trim() || faq.answer.trim(),
    );
    if (faqs.some((faq) => !faq.question.trim() || !faq.answer.trim())) {
      showValidationError(
        "Complete both fields or remove each unfinished FAQ.",
        "faqs",
      );
      return;
    }

    const variants = form.variants ?? [];
    if (
      variants.some(
        (variant) =>
          !variant.name.trim() ||
          !Number.isFinite(variant.price) ||
          variant.price <= 0,
      )
    ) {
      showValidationError(
        "Every variant needs a name and a price greater than zero.",
        "variants",
      );
      return;
    }

    const colors = form.colors ?? [];
    if (colors.some((color) => !color.name.trim())) {
      showValidationError("Give each color a name or remove the empty color.", "colors");
      return;
    }

   const product: Product = {
  ...form,
  name,
  price: Number(form.price),
      features: (form.features ?? []).map((feature) => feature.trim()).filter(Boolean),
      images: (form.images ?? []).filter(Boolean),
      specifications: Object.fromEntries(
        Object.entries(form.specifications ?? {})
          .filter(([key]) => key.trim())
          .map(([key, value]) => [key.trim(), value.trim()]),
      ),
      faqs: faqs.map((faq) => ({
        question: faq.question.trim(),
        answer: faq.answer.trim(),
      })),
      variants: variants.map((variant) => ({
        ...variant,
        name: variant.name.trim(),
        size: variant.size?.trim(),
        model: variant.model?.trim(),
        sku: variant.sku?.trim(),
        dimensions: variant.dimensions?.trim(),
        specifications: Object.fromEntries(
          Object.entries(variant.specifications ?? {})
            .filter(([key]) => key.trim())
            .map(([key, value]) => [key.trim(), value.trim()]),
        ),
      })),
      colors: colors.map((color) => ({
        ...color,
        name: color.name.trim(),
        images: (color.images ?? []).filter(Boolean),
      })),
    };

    // Only clean up session uploads that are not used by the saved product.
    const currentImageIds = new Set(getProductCloudinaryPublicIds(product));
    const removedExistingImageIds = (
      initialProduct ? getProductCloudinaryPublicIds(initialProduct) : []
    ).filter((publicId) => !currentImageIds.has(publicId));
    const unusedSessionImageIds = sessionUploads
      .filter((asset) => !currentImageIds.has(asset.publicId))
      .map((asset) => asset.publicId);
    const cleanupIds = [...unusedSessionImageIds, ...removedExistingImageIds];

    try {
      await onSave(product);
      setProductSaved(true);
      setPendingCleanupIds(cleanupIds);
      try {
        await cleanupCloudinaryAssets(cleanupIds);
        setPendingCleanupIds([]);
        setSessionUploads([]);
        onClose();
      } catch (cleanupError) {
        console.error("Image cleanup failed after saving:", cleanupError);
        setError(
          "Product saved successfully, but some unused images could not be removed. Use Retry Image Cleanup to try again.",
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the product.");
    }
  }

  const sectionClass = "rounded-xl border border-gray-200 bg-white p-4 sm:p-5";
  const labelClass = "block min-w-0 text-sm font-medium text-gray-700";
  const inputClass =
    "mt-1 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-normal text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-2 backdrop-blur-[2px] sm:p-5">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-editor-title"
        className="flex h-[min(780px,calc(100dvh-1rem))] max-h-[calc(100dvh-1rem)] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:h-[min(780px,calc(100dvh-2.5rem))] sm:max-h-[calc(100dvh-2.5rem)]"
      >
        {/* Fixed modal header */}
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <h2
  id="product-editor-title"
  className="truncate text-2xl font-medium leading-tight tracking-tight text-gray-900 sm:text-[28px]"
>
  {initialProduct ? "Edit Product" : "Add Product"}
</h2>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Manage product information, media, and options.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close product editor"
            onClick={() => void handleCancel()}
            disabled={isBusy}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </header>


{/* Product section tabs */}
<nav
  aria-label="Product sections"
  className="shrink-0 border-b border-gray-200 bg-white px-3 sm:px-6"
>
  <div
    role="tablist"
    aria-label="Product information sections"
    className="flex h-12 w-full items-stretch gap-1"
  >
    {tabs.map((tab) => {
      const isActive = activeTab === tab.id;

      return (
        <button
          key={tab.id}
          id={`product-tab-${tab.id}`}
          type="button"
          role="tab"
          aria-selected={isActive}
          aria-controls={`product-panel-${tab.id}`}
          onClick={() => switchTab(tab.id)}
          disabled={isBusy || productSaved}
          className={`relative flex min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-t-md px-1 text-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset ${
            isActive
              ? "text-blue-700"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {tab.label}

          {isActive && (
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-2 right-2 h-0.5 rounded-t bg-blue-600"
            />
          )}
        </button>
      );
    })}
  </div>
</nav>

        {/* Independently scrollable section content */}
        <div
          ref={contentRef}
          id={`product-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`product-tab-${activeTab}`}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-gray-50/60 p-3 sm:p-5"
        >
          {error && (
            <div role="alert" className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="min-w-0 flex-1">{error}</p>
              <button type="button" aria-label="Dismiss error" onClick={() => setError("")} className="shrink-0 rounded p-0.5 text-red-500 hover:bg-red-100">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {uploading && (
            <div role="status" className="mb-4 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5 text-sm text-blue-700">
              <Upload className="h-4 w-4 animate-pulse" />
              Uploading image(s)…
            </div>
          )}

          {/* BASIC DETAILS */}
          {activeTab === "details" && (
            <section className={sectionClass}>
              <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(250px,0.8fr)]">
                <div className="min-w-0">
                  <div className="mb-5">
                    <h3 className="text-lg font-semibold text-gray-900">Basic Details</h3>
                    <p className="mt-1 text-sm text-gray-500">Enter the product information and pricing.</p>
                  </div>

                  <div className="grid min-w-0 grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                   <label className={labelClass}>
  Product name <span className="text-red-500">*</span>
  <input
    className={inputClass}
    value={form.name}
    disabled={isBusy || productSaved}
    onChange={(event) => update("name", event.target.value)}
    placeholder="e.g. Haier Refrigerator"
  />
  <span className="mt-1 block text-xs font-normal text-gray-400">
    This is the name customers see in your store.
  </span>
</label>

                    <label className={labelClass}>
                      Model number
                      <input
                        className={inputClass}
                        value={form.model ?? ""}
                        disabled={isBusy || productSaved}
                        onChange={(event) => update("model", event.target.value)}
                        placeholder="e.g. HRF-438"
                      />
                    </label>

                    <label className={labelClass}>
                      Category <span className="text-red-500">*</span>
                      <select className={inputClass} value={form.categoryId} disabled={isBusy || productSaved} onChange={(event) => update("categoryId", event.target.value)}>
                        {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                      </select>
                    </label>

                    <label className={labelClass}>
                      Brand <span className="text-red-500">*</span>
                      <select className={inputClass} value={form.brandId} disabled={isBusy || productSaved} onChange={(event) => update("brandId", event.target.value)}>
                        {brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                      </select>
                    </label>

                    <label className={labelClass}>
                      Price (Rs.) <span className="text-red-500">*</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        className={inputClass}
                        value={form.price === 0 ? "" : form.price}
                        disabled={isBusy || productSaved}
                        onChange={(event) => {
                          const value = event.target.value;
                          update("price", value === "" ? 0 : Math.max(0, Number(value)));
                        }}
                        placeholder="Enter selling price"
                      />
                    </label>

                    <label className={labelClass}>
                      Maximum price <span className="font-normal text-gray-400">(optional)</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        className={inputClass}
                        value={form.priceMax ?? ""}
                        disabled={isBusy || productSaved}
                        onChange={(event) => update("priceMax", event.target.value === "" ? undefined : Math.max(0, Number(event.target.value)))}
                        placeholder="Optional original price"
                      />
                    </label>

                    <label className={`${labelClass} sm:col-span-2`}>
                      Product description
                      <textarea
                        rows={3}
                        className={inputClass}
                        value={form.description ?? ""}
                        disabled={isBusy || productSaved}
                        onChange={(event) => update("description", event.target.value)}
                        placeholder="Describe the product for customers..."
                      />
                    </label>
                  </div>
                </div>

                <aside className="min-w-0">
                  <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-900">Main Product Image <span className="text-red-500">*</span></h4>
                      <p className="mt-1 text-xs text-gray-500">Preview the main image shown in your store.</p>
                    </div>

                    <div className="flex h-48 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-3">
                      {form.image ? (
                        <img src={form.image} alt={form.name || "Product preview"} className="h-full w-full object-contain" />
                      ) : (
                        <div className="px-4 text-center">
                          <Package className="mx-auto h-8 w-8 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">No image selected</p>
                          <p className="mt-1 text-xs text-gray-400">Upload a product image to preview it here.</p>
                        </div>
                      )}
                    </div>

                    <label className={`mt-3 flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-50 ${isBusy || productSaved ? "pointer-events-none opacity-50" : ""}`}>
                      <Upload className="h-4 w-4" />
                      {uploading ? "Uploading…" : form.image ? "Replace Main Image" : "Upload Main Image"}
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={isBusy || productSaved} className="hidden" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; if (file) void handleImageUpload([file], { type: "main" }); }} />
                    </label>

                    <div className="mt-5 border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold text-gray-900">Additional Images</h4>
                        <span className="text-xs text-gray-500">{(form.images ?? []).length} added</span>
                      </div>
                      {(form.images ?? []).length > 0 ? (
                        <div className="mt-3 grid grid-cols-4 gap-2">
                          {(form.images ?? []).slice(0, 4).map((url, index) => (
                            <div key={`${url}-${index}`} className="flex h-14 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-1">
                              <img src={url} alt={`Additional image ${index + 1}`} className="h-full w-full object-contain" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-xs text-gray-500">No additional images added.</p>
                      )}
                      <button type="button" onClick={() => switchTab("images")} className="mt-3 text-sm font-medium text-blue-700 transition hover:text-blue-800">Manage images →</button>
                    </div>
                  </div>
                </aside>
              </div>
            </section>
          )}

          {/* IMAGES */}
          {activeTab === "images" && (
            <section className={sectionClass}>
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
                <p className="mt-1 text-sm text-gray-500">Choose a main image and add extra views of the product.</p>
              </div>

              <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.5fr)]">
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900">Main Product Image <span className="text-red-500">*</span></h4>
                  <p className="mt-1 text-xs text-gray-500">The primary image customers see in your store.</p>
                  <div className="mt-3 flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                    {form.image ? (
                      <img src={form.image} alt="Main product preview" className="h-40 w-full object-contain" />
                    ) : (
                      <div className="flex h-40 flex-col items-center justify-center text-center">
                        <ImagePlus className="h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">No image selected</p>
                      </div>
                    )}
                    <label className={`mt-3 inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-50 ${isBusy || productSaved ? "pointer-events-none opacity-50" : ""}`}>
                      <Upload className="h-4 w-4" />
                      {form.image ? "Upload / Replace Image" : "Upload Main Image"}
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={isBusy || productSaved} className="hidden" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; if (file) void handleImageUpload([file], { type: "main" }); }} />
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">JPG, PNG, WebP or AVIF. Maximum 5 MB per image.</p>
                </div>

                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Additional Images</h4>
                      <p className="mt-1 text-xs text-gray-500">Show different angles and product details.</p>
                    </div>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">{(form.images ?? []).length} images</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                    {(form.images ?? []).map((url, index) => (
                      <div key={`${url}-${index}`} className="relative flex min-w-0 flex-col rounded-xl border border-gray-200 bg-white p-2">
                        <div className="flex h-24 items-center justify-center">
                          <img src={url} alt={`Additional product image ${index + 1}`} className="h-full w-full object-contain" />
                        </div>
                        <span className="mt-1 truncate text-center text-xs text-gray-500">Image {index + 1}</span>
                        <button type="button" aria-label={`Remove additional image ${index + 1}`} title="Remove image" disabled={isBusy || productSaved} onClick={() => update("images", (form.images ?? []).filter((_, imageIndex) => imageIndex !== index))} className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-red-100 bg-white text-red-600 shadow-sm transition hover:bg-red-50 disabled:opacity-40">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    <label className={`flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-blue-300 bg-blue-50/50 p-3 text-center transition hover:bg-blue-50 ${isBusy || productSaved ? "pointer-events-none opacity-50" : ""}`}>
                      <Plus className="h-6 w-6 text-blue-600" />
                      <span className="mt-2 text-xs font-medium text-blue-700">Add Images</span>
                      <span className="mt-1 text-[10px] text-gray-500">Select multiple</span>
                      <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" disabled={isBusy || productSaved} className="hidden" onChange={(event) => { const files = Array.from(event.target.files ?? []) as File[]; event.target.value = ""; if (files.length) void handleImageUpload(files, { type: "additional" }); }} />
                    </label>
                  </div>
                  {(form.images ?? []).length === 0 && <p className="mt-3 text-xs text-gray-400">No additional images added yet.</p>}
                </div>
              </div>
            </section>
          )}

          {/* FEATURES */}
          {activeTab === "features" && (
            <section className={sectionClass}>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Product Features</h3>
                  <p className="mt-1 text-sm text-gray-500">Add the main benefits and features customers should know about.</p>
                </div>
                <span className="inline-flex w-fit items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{(form.features ?? []).filter((feature) => feature.trim()).length} features</span>
              </div>

              <div className="mt-5 space-y-2.5">
                {(form.features ?? []).map((feature, index) => (
                  <div key={index} className="group flex min-w-0 items-center gap-2.5 rounded-xl border border-gray-200 bg-white p-2.5 transition-colors hover:border-gray-300 sm:gap-3">
                    <GripVertical aria-hidden="true" className="h-4 w-4 shrink-0 text-gray-400" />
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-medium text-gray-600">{String(index + 1).padStart(2, "0")}</span>
                    <input aria-label={`Feature ${index + 1}`} className="min-w-0 flex-1 border-0 bg-transparent px-1 py-2 text-sm font-normal text-gray-800 outline-none placeholder:text-gray-400 focus:ring-0 disabled:opacity-60" value={feature} placeholder={`Enter feature ${index + 1}...`} disabled={isBusy || productSaved} onChange={(event) => update("features", (form.features ?? []).map((item, i) => i === index ? event.target.value : item))} />
                    <button type="button" aria-label={`Remove feature ${index + 1}`} title="Remove feature" disabled={isBusy || productSaved} onClick={() => update("features", (form.features ?? []).filter((_, i) => i !== index))} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {(form.features ?? []).length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50/70 px-4 py-10 text-center">
                    <ImagePlus className="h-7 w-7 text-gray-400" />
                    <p className="mt-3 text-sm font-medium text-gray-700">No features added yet</p>
                    <p className="mt-1 max-w-xs text-xs text-gray-500">Add product benefits such as energy efficiency, performance, or quiet operation.</p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500">Keep each feature clear and concise.</p>
                <button type="button" disabled={isBusy || productSaved} onClick={() => update("features", [...(form.features ?? []), ""])} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                  <Plus className="h-4 w-4" /> Add Feature
                </button>
              </div>
            </section>
          )}

          {/* SPECIFICATIONS */}
          {activeTab === "specifications" && (
            <section className={sectionClass}>
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
                <p className="mt-1 text-sm text-gray-500">Organize technical details into easy-to-read name and value pairs.</p>
              </div>
              <SpecificationFields
                key={`${initialProduct?.id ?? "new-product"}-product-specifications`}
                value={form.specifications}
                onChange={(value) => update("specifications", value)}
                disabled={isBusy || productSaved}
              />
            </section>
          )}

          {/* FAQS */}
          {activeTab === "faqs" && (
            <section className={sectionClass}>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h3>
                  <p className="mt-1 text-sm text-gray-500">Answer common questions customers may have about this product.</p>
                </div>
                <span className="inline-flex w-fit items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{(form.faqs ?? []).filter((faq) => faq.question.trim() || faq.answer.trim()).length} FAQs</span>
              </div>

              <div className="mt-5 space-y-3">
                {(form.faqs ?? []).map((faq, index) => (
                  <div key={index} className="rounded-xl border border-gray-200 bg-white p-3 transition-colors hover:border-gray-300 sm:p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-medium text-blue-700">{String(index + 1).padStart(2, "0")}</span>
                        <span className="truncate text-sm font-medium text-gray-700">FAQ {index + 1}</span>
                      </div>
                      <button type="button" aria-label={`Remove FAQ ${index + 1}`} title="Remove FAQ" disabled={isBusy || productSaved} onClick={() => update("faqs", (form.faqs ?? []).filter((_, i) => i !== index))} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid min-w-0 grid-cols-1 gap-3">
                      <label className={labelClass}>
                        Question
                        <input className={inputClass} value={faq.question} disabled={isBusy || productSaved} onChange={(event) => update("faqs", (form.faqs ?? []).map((item, i) => i === index ? { ...item, question: event.target.value } : item))} placeholder="e.g. What is the warranty period?" />
                      </label>
                      <label className={labelClass}>
                        Answer
                        <textarea rows={2} className={inputClass} value={faq.answer} disabled={isBusy || productSaved} onChange={(event) => update("faqs", (form.faqs ?? []).map((item, i) => i === index ? { ...item, answer: event.target.value } : item))} placeholder="Write a clear answer for your customers..." />
                      </label>
                    </div>
                  </div>
                ))}
                {(form.faqs ?? []).length === 0 && (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/70 px-4 py-10 text-center">
                    <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-xl text-gray-400">?</span>
                    <p className="mt-3 text-sm font-medium text-gray-700">No FAQs added yet</p>
                    <p className="mx-auto mt-1 max-w-sm text-xs text-gray-500">Add answers about warranty, delivery, usage, and product features.</p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500">Complete both fields or remove an unfinished FAQ before saving.</p>
                <button type="button" disabled={isBusy || productSaved} onClick={() => update("faqs", [...(form.faqs ?? []), { question: "", answer: "" }])} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                  <Plus className="h-4 w-4" /> Add FAQ
                </button>
              </div>
            </section>
          )}

          {/* VARIANTS */}
          {activeTab === "variants" && (
            <section className={sectionClass}>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Product Variants</h3>
                  <p className="mt-1 text-sm text-gray-500">Manage different models, sizes, and prices for this product.</p>
                </div>
                <span className="inline-flex w-fit items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{(form.variants ?? []).length} variants</span>
              </div>

              <div className="mt-5 space-y-3">
                {(form.variants ?? []).map((variant, index) => (
                  <div key={index} className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white transition-colors hover:border-gray-300">
                    <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/70 px-3 py-3 sm:px-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600">{String(index + 1).padStart(2, "0")}</span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-800">{variant.name.trim() || `Variant ${index + 1}`}</p>
                          <p className="mt-0.5 text-xs text-gray-500">{variant.model?.trim() || "Model not specified"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="hidden text-sm font-medium tabular-nums text-gray-700 sm:inline">{variant.price > 0 ? `Rs. ${variant.price.toLocaleString("en-PK")}` : "Price not set"}</span>
                        <button type="button" aria-label={`Remove variant ${index + 1}`} title="Remove variant" disabled={isBusy || productSaved} onClick={() => update("variants", (form.variants ?? []).filter((_, i) => i !== index))} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4 p-3 sm:p-4">
                      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                        <label className={labelClass}>
                          Variant name <span className="text-red-500">*</span>
                          <input className={inputClass} value={variant.name} disabled={isBusy || productSaved} onChange={(event) => updateVariant(index, { name: event.target.value })} placeholder="e.g. 1.5 Ton Inverter" />
                        </label>
                        <label className={labelClass}>
                          Price (Rs.) <span className="text-red-500">*</span>
                          <input type="number" min="0" step="1" className={inputClass} value={variant.price === 0 ? "" : variant.price} disabled={isBusy || productSaved} onChange={(event) => { const value = event.target.value; updateVariant(index, { price: value === "" ? 0 : Math.max(0, Number(value)) }); }} placeholder="Enter variant price" />
                        </label>
                        <label className={labelClass}>
                          Size or capacity
                          <input className={inputClass} value={variant.size ?? ""} disabled={isBusy || productSaved} onChange={(event) => updateVariant(index, { size: event.target.value })} placeholder="e.g. 12 cubic feet" />
                        </label>
                        <label className={labelClass}>
                          Model number
                          <input className={inputClass} value={variant.model ?? ""} disabled={isBusy || productSaved} onChange={(event) => updateVariant(index, { model: event.target.value })} placeholder="Enter model number" />
                        </label>
                      </div>

                      <details className="group rounded-lg border border-gray-200">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 [&::-webkit-details-marker]:hidden">
                          <span>Additional details</span>
                          <ChevronDown className="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="space-y-4 border-t border-gray-200 p-3 sm:p-4">
                          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                            <label className={labelClass}>
                              SKU
                              <input className={inputClass} value={variant.sku ?? ""} disabled={isBusy || productSaved} onChange={(event) => updateVariant(index, { sku: event.target.value })} placeholder="Stock keeping unit" />
                            </label>
                            <label className={labelClass}>
                              Dimensions
                              <input className={inputClass} value={variant.dimensions ?? ""} disabled={isBusy || productSaved} onChange={(event) => updateVariant(index, { dimensions: event.target.value })} placeholder="e.g. 60 × 65 × 170 cm" />
                            </label>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-700">Variant image</p>
                            <p className="mt-1 text-xs text-gray-500">Optional image for this specific model or size.</p>
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                              {variant.image ? (
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white p-2">
                                  <img src={variant.image} alt={`${variant.name || "Variant"} preview`} className="h-full w-full object-contain" />
                                </div>
                              ) : (
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-400"><ImagePlus className="h-6 w-6" /></div>
                              )}
                              <div className="flex flex-wrap gap-2">
                                <label className={`inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 ${isBusy || productSaved ? "pointer-events-none opacity-50" : ""}`}>
                                  <Upload className="h-4 w-4" /> {variant.image ? "Replace image" : "Upload image"}
                                  <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={isBusy || productSaved} className="hidden" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; if (file) void handleImageUpload([file], { type: "variant", index }); }} />
                                </label>
                                {variant.image && <button type="button" disabled={isBusy || productSaved} onClick={() => updateVariant(index, { image: undefined })} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-red-100 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-40">Remove image</button>}
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-gray-100 pt-4">
                            <h4 className="mb-3 text-sm font-medium text-gray-800">Variant specifications</h4>
                            <SpecificationFields
                              key={`${initialProduct?.id ?? "new-product"}-variant-${index}`}
                              value={variant.specifications}
                              onChange={(specifications) => updateVariant(index, { specifications })}
                              disabled={isBusy || productSaved}
                            />
                          </div>
                        </div>
                      </details>
                    </div>
                  </div>
                ))}

                {(form.variants ?? []).length === 0 && (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/70 px-4 py-10 text-center">
                    <Package className="mx-auto h-7 w-7 text-gray-400" />
                    <p className="mt-3 text-sm font-medium text-gray-700">No variants added yet</p>
                    <p className="mx-auto mt-1 max-w-sm text-xs text-gray-500">Add variants if this product is available in different models, capacities, or sizes.</p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500">Each variant needs a name and a price greater than zero.</p>
                <button type="button" disabled={isBusy || productSaved} onClick={() => update("variants", [...(form.variants ?? []), { name: "", price: 0 }])} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                  <Plus className="h-4 w-4" /> Add Variant
                </button>
              </div>
            </section>
          )}

          {/* COLORS */}
          {activeTab === "colors" && (
            <section className={sectionClass}>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Available Colors</h3>
                  <p className="mt-1 text-sm text-gray-500">Add product colors and upload images for each option.</p>
                </div>
                <span className="inline-flex w-fit items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{(form.colors ?? []).length} colors</span>
              </div>

              <div className="mt-5 grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-2">
                {(form.colors ?? []).map((color, index) => (
                  <div key={index} className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white transition-colors hover:border-gray-300">
                    <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/70 p-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600">{String(index + 1).padStart(2, "0")}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800">{color.name.trim() || `Color ${index + 1}`}</p>
                        <p className="mt-0.5 text-xs text-gray-500">{(color.images ?? []).length} images</p>
                      </div>
                      <button type="button" aria-label={`Remove color ${index + 1}`} title="Remove color" disabled={isBusy || productSaved} onClick={() => update("colors", (form.colors ?? []).filter((_, i) => i !== index))} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-4 p-3 sm:p-4">
                      <label className={labelClass}>
                        Color name <span className="text-red-500">*</span>
                        <input className={inputClass} value={color.name} disabled={isBusy || productSaved} onChange={(event) => updateColor(index, { name: event.target.value })} placeholder="e.g. Silver, Black, White" />
                      </label>

                      <div>
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-gray-700">Color images</p>
                          <p className="text-xs text-gray-500">Optional</p>
                        </div>

                        {(color.images ?? []).length > 0 ? (
                          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                            {(color.images ?? []).map((url, imageIndex) => (
                              <div key={`${url}-${imageIndex}`} className="group min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
                                <div className="flex h-20 items-center justify-center bg-gray-50 p-2"><img src={url} alt={`${color.name || "Color"} image ${imageIndex + 1}`} className="h-full w-full object-contain" /></div>
                                <div className="border-t border-gray-100 p-1.5">
                                  <button type="button" aria-label={`Remove image ${imageIndex + 1} from ${color.name || `color ${index + 1}`}`} disabled={isBusy || productSaved} onClick={() => updateColor(index, { images: (color.images ?? []).filter((_, i) => i !== imageIndex) })} className="flex w-full items-center justify-center gap-1 rounded-md px-1 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40">
                                    <Trash2 className="h-3.5 w-3.5" /> Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex min-h-28 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50/70 px-3 py-5 text-center">
                            <ImagePlus className="h-7 w-7 text-gray-400" />
                            <p className="mt-2 text-xs text-gray-500">No images added for this color.</p>
                          </div>
                        )}

                        <label className={`mt-3 inline-flex min-h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-50 ${isBusy || productSaved ? "pointer-events-none opacity-50" : ""}`}>
                          <Plus className="h-4 w-4" /> {uploading ? "Uploading…" : "Upload Color Images"}
                          <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" disabled={isBusy || productSaved} className="hidden" onChange={(event) => { const files = Array.from(event.target.files ?? []) as File[]; event.target.value = ""; if (files.length) void handleImageUpload(files, { type: "color", index }); }} />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {(form.colors ?? []).length === 0 && (
                <div className="mt-5 rounded-xl border border-dashed border-gray-300 bg-gray-50/70 px-4 py-10 text-center">
                  <ImagePlus className="mx-auto h-7 w-7 text-gray-400" />
                  <p className="mt-3 text-sm font-medium text-gray-700">No colors added yet</p>
                  <p className="mx-auto mt-1 max-w-sm text-xs text-gray-500">Add colors such as silver, black, or white when your product is available in multiple finishes.</p>
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500">Each color needs a name. Images are optional.</p>
                <button type="button" disabled={isBusy || productSaved} onClick={() => update("colors", [...(form.colors ?? []), { name: "", images: [] }])} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                  <Plus className="h-4 w-4" /> Add Color
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Fixed footer */}
        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-200 bg-white px-3 py-3 sm:px-5 sm:py-4">
          <div className="min-w-0">
            {initialProduct && !productSaved && (
              <button
                type="button"
                onClick={() => { setDeleteError(""); setDeleteConfirmOpen(true); }}
                disabled={isBusy}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Delete Product</span>
                <span className="sm:hidden">Delete</span>
              </button>
            )}
          </div>
          <div className="ml-auto flex shrink-0 gap-2 sm:gap-3">
            <button type="button" onClick={() => void handleCancel()} disabled={isBusy} className="inline-flex min-h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4">
              Cancel
            </button>
            <button type="button" onClick={() => void submit()} disabled={isBusy} className="inline-flex min-h-10 min-w-[112px] shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium leading-5 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? "Saving…" : productSaved ? "Retry Cleanup" : initialProduct ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </footer>
      </div>

      {/* In-site delete confirmation */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-[2px]">
          <div role="dialog" aria-modal="true" aria-labelledby="delete-product-title" className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600"><AlertTriangle className="h-5 w-5" /></div>
              <div className="min-w-0">
                <h3 id="delete-product-title" className="text-lg font-semibold text-gray-900">Delete Product?</h3>
                <p className="mt-2 break-words text-sm leading-6 text-gray-600">
                  Are you sure you want to delete <span className="font-medium text-gray-900">{initialProduct?.name}</span>? This product will be removed from the store catalogue.
                </p>
              </div>
            </div>
            {deleteError && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{deleteError}</p>}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => { if (deleting) return; setDeleteConfirmOpen(false); setDeleteError(""); }} disabled={deleting} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50">Cancel</button>
              <button type="button" onClick={() => void confirmDelete()} disabled={deleting || saving || uploading} className="inline-flex min-h-10 items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">{deleting ? "Deleting…" : "Confirm Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
