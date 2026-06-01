"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";
import type { Product } from "@/types/product";
import type { BearColor, BearSize, Occasion, ProductBadge } from "@/types/product";
import { BEAR_COLORS, BEAR_SIZES, OCCASIONS } from "@/lib/products";
import { adminUploadProductImage } from "@/lib/actions/admin";
import { toastError, toastSuccess } from "@/store/toastStore";

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
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (initial) {
      const { id: _id, createdAt: _c, ...rest } = initial;
      setForm(rest);
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
    const cleanedImages = form.images
      .map((img) => img.trim())
      .filter(Boolean);
    const primaryImage = form.image.trim() || cleanedImages[0];
    const images = cleanedImages.length ? cleanedImages : primaryImage ? [primaryImage] : [];
    onSubmit({ ...form, image: primaryImage, images });
  };

  const uploadImage = async () => {
    if (!imageFile) return;
    setUploading(true);
    setUploadError("");
    try {
      const data = new FormData();
      data.set("file", imageFile);
      const uploaded = await adminUploadProductImage(data);
      const nextImages = [uploaded.url, ...form.images.filter((img) => img !== uploaded.url)];
      setForm((prev) => ({ ...prev, image: uploaded.url, images: nextImages }));
      setImageFile(null);
      toastSuccess("Image uploaded successfully");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Upload failed";
      setUploadError(msg);
      toastError(msg);
    } finally {
      setUploading(false);
    }
  };

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
              <option key={s} value={s}>{s}</option>
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
              <option key={c} value={c}>{c}</option>
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
        <div className="sm:col-span-2 space-y-3 rounded-xl border border-caramel/15 p-4">
          <label className="text-sm font-medium block">Product Images</label>
          <p className="text-xs text-ink-muted">
            Use an image URL or upload a file to Supabase Storage.
          </p>
          <div>
            <label className="text-xs font-medium mb-1 block">Primary image URL</label>
            <input
              value={form.image}
              onChange={(e) => update("image", e.target.value)}
              className="input-field"
              placeholder="https://... or /images/..."
            />
          </div>
          <div className="grid sm:grid-cols-[1fr_auto] gap-2 items-end">
            <div>
              <label className="text-xs font-medium mb-1 block">Upload image file (max 5MB)</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="input-field py-2"
              />
            </div>
            <button
              type="button"
              onClick={uploadImage}
              disabled={!imageFile || uploading}
              className="btn-outline"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Upload
            </button>
          </div>
          {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
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
              className="input-field resize-y"
              placeholder="https://...&#10;https://..."
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[form.image, ...form.images]
              .filter(Boolean)
              .filter((img, index, arr) => arr.indexOf(img) === index)
              .slice(0, 4)
              .map((img) => (
                <div key={img} className="relative aspect-square rounded-lg overflow-hidden bg-cream border border-caramel/10">
                  <Image src={img} alt="Preview" fill className="object-cover" />
                </div>
              ))}
          </div>
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
        <button type="submit" className="btn-primary bg-caramel">{submitLabel}</button>
        <button type="button" onClick={onCancel} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
}
