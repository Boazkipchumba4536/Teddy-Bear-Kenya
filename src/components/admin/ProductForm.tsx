"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/types/product";
import type { BearColor, BearSize, Occasion, ProductBadge } from "@/types/product";
import { BEAR_COLORS, BEAR_SIZES, OCCASIONS } from "@/lib/products";
import { adminUploadProductImage } from "@/lib/actions/admin";
import { toastError, toastSuccess } from "@/store/toastStore";
import ProductImagePreview from "./ProductImagePreview";
import { Loader2, Upload, CheckCircle } from "lucide-react";

const occasionOptions = OCCASIONS.filter((o) => o !== "All") as Occasion[];

interface ProductFormProps {
  initial?: Product;
  onSubmit: (data: Omit<Product, "id" | "createdAt">) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const emptyProduct = (): Omit<Product, "id" | "createdAt"> => ({
  slug: "",
  name: "",
  tagline: "",
  description: "",
  careInstructions: "Spot clean with mild detergent. Air dry.",
  deliveryInfo: "Same-day Nairobi before 12PM. Standard 2–3 days nationwide.",
  price: 2500,
  size: "M",
  color: "Brown",
  occasions: ["Just Because"],
  image: "/images/image2.webp",
  images: ["/images/image2.webp"],
  featured: false,
});

export default function ProductForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save Product",
}: ProductFormProps) {
  const [form, setForm] = useState<Omit<Product, "id" | "createdAt">>(
    initial ?? emptyProduct()
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initial) {
      const { id: _id, createdAt: _c, ...rest } = initial;
      setForm(rest);
      setUploadedUrl(null);
    }
  }, [initial]);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleOccasion = (o: Occasion) =>
    update(
      "occasions",
      form.occasions.includes(o)
        ? form.occasions.filter((x) => x !== o)
        : [...form.occasions, o]
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedImages = form.images.map((img) => img.trim()).filter(Boolean);
    const primaryImage = form.image.trim() || cleanedImages[0];
    const images = cleanedImages.length ? cleanedImages : primaryImage ? [primaryImage] : [];
    if (!primaryImage) {
      toastError("Add a primary image URL or upload a file first.");
      return;
    }
    onSubmit({ ...form, image: primaryImage, images });
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setUploadError("");
    setUploadedUrl(null);
    try {
      const data = new FormData();
      data.set("file", file);
      const uploaded = await adminUploadProductImage(data);
      const nextImages = [uploaded.url, ...form.images.filter((img) => img !== uploaded.url)];
      setForm((prev) => ({ ...prev, image: uploaded.url, images: nextImages }));
      setUploadedUrl(uploaded.url);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toastSuccess("Image uploaded — click Save Product to store it in the catalog.");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Upload failed";
      setUploadError(msg);
      toastError(msg);
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void uploadFile(file);
  };

  const previewImages = [form.image, ...form.images]
    .filter(Boolean)
    .filter((img, index, arr) => arr.indexOf(img) === index)
    .slice(0, 6);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl p-6 shadow-card">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-sm font-medium mb-1 block">Product Name *</label>
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Slug</label>
          <input
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
            className="input-field"
            placeholder="auto-generated if empty"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Price (KSh) *</label>
          <input
            required
            type="number"
            min={100}
            value={form.price}
            onChange={(e) => update("price", Number(e.target.value))}
            className="input-field"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium mb-1 block">Tagline</label>
          <input
            value={form.tagline}
            onChange={(e) => update("tagline", e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Size</label>
          <select
            value={form.size}
            onChange={(e) => update("size", e.target.value as BearSize)}
            className="input-field"
          >
            {BEAR_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Color</label>
          <select
            value={form.color}
            onChange={(e) => update("color", e.target.value as BearColor)}
            className="input-field"
          >
            {BEAR_COLORS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Badge</label>
          <select
            value={form.badge ?? ""}
            onChange={(e) =>
              update("badge", (e.target.value || undefined) as ProductBadge | undefined)
            }
            className="input-field"
          >
            <option value="">None</option>
            <option value="Best Seller">Best Seller</option>
            <option value="New Arrival">New Arrival</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured ?? false}
              onChange={(e) => update("featured", e.target.checked)}
              className="w-4 h-4 accent-caramel"
            />
            <span className="text-sm font-medium">Featured product</span>
          </label>
        </div>

        <div className="sm:col-span-2 space-y-3 rounded-xl border border-caramel/15 p-4 bg-cream/30">
          <label className="text-sm font-medium block">Product Images</label>
          <p className="text-xs text-ink-muted">
            Choose a file to upload to Supabase (max 5MB), or paste a URL. After upload, click{" "}
            <strong>Save Product</strong> below.
          </p>

          {uploadedUrl && (
            <div className="flex items-start gap-2 text-sm text-mpesa bg-mpesa/10 rounded-lg p-3">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Uploaded to storage. Save the product to publish this image on the shop.</span>
            </div>
          )}

          <div>
            <label className="text-xs font-medium mb-1 block">Upload image (JPG, PNG, WEBP, GIF)</label>
            <div className="flex flex-wrap gap-2 items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
                onChange={onFileChange}
                disabled={uploading}
                className="input-field py-2 flex-1 min-w-[200px]"
              />
              {uploading && (
                <span className="inline-flex items-center gap-2 text-sm text-caramel">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading…
                </span>
              )}
            </div>
          </div>

          {uploadError && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg p-2">{uploadError}</p>
          )}

          <div>
            <label className="text-xs font-medium mb-1 block">Primary image URL</label>
            <input
              value={form.image}
              onChange={(e) => update("image", e.target.value)}
              className="input-field"
              placeholder="https://....supabase.co/storage/... or /images/..."
            />
          </div>

          <div>
            <label className="text-xs font-medium mb-1 block">Gallery URLs (one per line)</label>
            <textarea
              rows={3}
              value={form.images.join("\n")}
              onChange={(e) =>
                update(
                  "images",
                  e.target.value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                )
              }
              className="input-field resize-y font-mono text-xs"
              placeholder="https://..."
            />
          </div>

          {previewImages.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-2">Preview</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {previewImages.map((img) => (
                  <div
                    key={img}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                      img === form.image ? "border-caramel" : "border-caramel/10"
                    } bg-cream`}
                  >
                    <ProductImagePreview src={img} alt="Product preview" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Occasions</label>
        <div className="flex flex-wrap gap-2">
          {occasionOptions.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => toggleOccasion(o)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                form.occasions.includes(o)
                  ? "bg-caramel text-white border-caramel"
                  : "border-gray-200"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="input-field resize-none"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Care Instructions</label>
          <textarea
            rows={2}
            value={form.careInstructions}
            onChange={(e) => update("careInstructions", e.target.value)}
            className="input-field resize-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Delivery Info</label>
          <textarea
            rows={2}
            value={form.deliveryInfo}
            onChange={(e) => update("deliveryInfo", e.target.value)}
            className="input-field resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary bg-caramel" disabled={uploading}>
          {submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="btn-outline" disabled={uploading}>
          Cancel
        </button>
      </div>
    </form>
  );
}
