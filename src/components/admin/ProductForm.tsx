"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/types/product";
import type { BearColor, BearSize, Occasion, ProductBadge } from "@/types/product";
import { BEAR_SIZES, OCCASIONS } from "@/lib/products";
import { normalizeBearColor } from "@/lib/bearColors";
import AdminColorPicker from "@/components/admin/AdminColorPicker";
import { mergeBrandOptions, TEDDY_BRANDS } from "@/lib/brands";
import { adminUploadProductImage } from "@/lib/actions/admin";
import { toastError, toastSuccess } from "@/store/toastStore";
import ProductImagePreview from "./ProductImagePreview";
import { CheckCircle } from "lucide-react";

const occasionOptions = OCCASIONS.filter((o) => o !== "All") as Occasion[];

interface ProductFormProps {
  initial?: Product;
  brandOptions?: string[];
  onSubmit: (data: Omit<Product, "id" | "createdAt">) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const emptyProduct = (): Omit<Product, "id" | "createdAt"> => ({
  slug: "",
  name: "",
  brand: "BearHug KE",
  inStock: true,
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
  brandOptions = [],
  onSubmit,
  onCancel,
  submitLabel = "Save Product",
}: ProductFormProps) {
  const [form, setForm] = useState<Omit<Product, "id" | "createdAt">>(
    initial ?? emptyProduct()
  );
  const brands = useMemo(
    () =>
      mergeBrandOptions([
        ...brandOptions,
        initial?.brand ?? "",
        form.brand,
      ]),
    [brandOptions, initial?.brand, form.brand]
  );
  const [uploadError, setUploadError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initial) {
      const { id: _id, createdAt: _c, ...rest } = initial;
      setForm({ ...rest, color: normalizeBearColor(rest.color) });
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
    const primaryImage = form.image.trim() || form.images.map((img) => img.trim()).find(Boolean) || "";
    if (!primaryImage) {
      toastError("Add a primary image URL or upload a file first.");
      return;
    }
    onSubmit({ ...form, image: primaryImage, images: [primaryImage] });
  };

  const uploadFile = async (file: File) => {
    setUploadError("");
    setUploadedUrl(null);
    try {
      const data = new FormData();
      data.set("file", file);
      const uploaded = await adminUploadProductImage(data);
      setForm((prev) => ({ ...prev, image: uploaded.url, images: [uploaded.url] }));
      setUploadedUrl(uploaded.url);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toastSuccess("Image uploaded — click Save Product to store it in the catalog.");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Upload failed";
      setUploadError(msg);
      toastError(msg);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void uploadFile(file);
  };

  const previewImage =
    form.image.trim() || form.images.map((img) => img.trim()).find(Boolean) || "";

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
          <label className="text-sm font-medium mb-1 block">Brand</label>
          <input
            list="product-brand-options"
            value={form.brand}
            onChange={(e) => update("brand", e.target.value)}
            className="input-field"
            placeholder="e.g. Tambo Teddies"
          />
          <datalist id="product-brand-options">
            {brands.map((b) => (
              <option key={b} value={b} />
            ))}
          </datalist>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => update("inStock", e.target.checked)}
              className="w-4 h-4 accent-caramel"
            />
            <span className="text-sm font-medium">In stock</span>
          </label>
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
        <AdminColorPicker value={form.color} onChange={(c) => update("color", c)} />
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
                className="input-field py-2 flex-1 min-w-[200px]"
              />
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

          {previewImage && (
            <div>
              <p className="text-xs font-medium mb-2">Preview</p>
              <div className="relative aspect-square max-w-[200px] rounded-lg overflow-hidden border-2 border-caramel bg-cream">
                <ProductImagePreview src={previewImage} alt="Product preview" />
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
        <button
          type="submit"
          className="btn-primary bg-caramel active:scale-[0.98] transition-transform"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-outline active:scale-[0.98] transition-transform"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
