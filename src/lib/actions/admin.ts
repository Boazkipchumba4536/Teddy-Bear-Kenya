"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapProductToDb, mapSiteSettingsToDb } from "@/lib/supabase/mappers";
import type { SiteSettings } from "@/types/admin";
import type { Product } from "@/types/product";
import { DEFAULT_TESTIMONIALS } from "@/lib/products";
import { SEED_CATALOG_PRODUCTS } from "@/lib/seedCatalog";
import { defaultSiteSettings } from "@/store/catalogStore";
import { isAllowedImageMime, resolveImageMime } from "@/lib/imageMime";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Admin access required");
  return user;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function safeFileName(name: string) {
  const parts = name.split(".");
  const ext = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "jpg";
  const base = parts[0]?.toLowerCase().replace(/[^a-z0-9-]+/g, "-") ?? "image";
  return `${base.slice(0, 40)}-${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
}

function revalidateStore() {
  revalidatePath("/", "layout");
  revalidatePath("/shop");
  revalidatePath("/admin");
  revalidatePath("/sitemap.xml");
}

export async function adminCreateProduct(
  data: Omit<Product, "id" | "createdAt"> & { slug?: string }
) {
  await requireAdmin();
  const admin = createAdminClient();
  const slug = data.slug || slugify(data.name);
  const row = mapProductToDb({ ...data, slug, images: data.images?.length ? data.images : [data.image] });

  const { data: created, error } = await admin.from("products").insert(row).select().single();
  if (error) throw new Error(error.message);
  revalidateStore();
  return created;
}

export async function adminUploadProductImage(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("No image file provided.");

  const contentType = resolveImageMime(file);
  if (!isAllowedImageMime(contentType)) {
    throw new Error(
      "Only JPG, PNG, WEBP, and GIF images are allowed. HEIC/iPhone photos: export as JPEG first."
    );
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be 5MB or smaller.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const ext =
    contentType === "image/jpeg"
      ? "jpg"
      : contentType.replace("image/", "") || "jpg";
  const filePath = `products/${safeFileName(file.name.replace(/\.[^.]+$/, `.${ext}`))}`;

  const { error: uploadError } = await admin.storage
    .from("product-images")
    .upload(filePath, Buffer.from(arrayBuffer), {
      contentType,
      upsert: false,
      cacheControl: "3600",
    });

  if (uploadError) {
    if (uploadError.message.includes("Bucket not found")) {
      throw new Error(
        "Storage bucket missing. Run supabase/migrations/002_product_images_storage.sql in Supabase SQL Editor."
      );
    }
    throw new Error(uploadError.message);
  }

  const { data } = admin.storage.from("product-images").getPublicUrl(filePath);
  if (!data?.publicUrl) throw new Error("Could not get uploaded image URL.");
  return { url: data.publicUrl, path: filePath };
}

export async function adminUpdateProduct(id: string, data: Partial<Product>) {
  await requireAdmin();
  const admin = createAdminClient();
  const patch: Record<string, unknown> = {};
  if (data.name !== undefined) patch.name = data.name;
  if (data.slug !== undefined) patch.slug = data.slug;
  if (data.tagline !== undefined) patch.tagline = data.tagline;
  if (data.description !== undefined) patch.description = data.description;
  if (data.careInstructions !== undefined) patch.care_instructions = data.careInstructions;
  if (data.deliveryInfo !== undefined) patch.delivery_info = data.deliveryInfo;
  if (data.price !== undefined) patch.price = data.price;
  if (data.size !== undefined) patch.size = data.size;
  if (data.color !== undefined) patch.color = data.color;
  if (data.occasions !== undefined) patch.occasions = data.occasions;
  if (data.image !== undefined) patch.image = data.image;
  if (data.images !== undefined) patch.images = data.images;
  if (data.badge !== undefined) patch.badge = data.badge ?? null;
  if (data.featured !== undefined) patch.featured = data.featured;

  const { error } = await admin.from("products").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateStore();
}

export async function adminDeleteProduct(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateStore();
}

export async function adminCreateTestimonial(data: Omit<{ name: string; city: string; rating: number; quote: string; occasion: string }, "id">) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("testimonials").insert(data);
  if (error) throw new Error(error.message);
  revalidateStore();
}

export async function adminUpdateTestimonial(
  id: string,
  data: Partial<{ name: string; city: string; rating: number; quote: string; occasion: string }>
) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("testimonials").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateStore();
}

export async function adminDeleteTestimonial(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateStore();
}

export async function adminUpdateSiteSettings(data: SiteSettings) {
  await requireAdmin();
  const admin = createAdminClient();
  const row = mapSiteSettingsToDb(data);
  const { error } = await admin.from("site_settings").update(row).eq("id", 1);
  if (error) throw new Error(error.message);
  revalidateStore();
}

export async function adminSeedCatalog(force = false) {
  await requireAdmin();
  const admin = createAdminClient();

  const { count } = await admin.from("products").select("*", { count: "exact", head: true });
  if ((count ?? 0) > 0 && !force) {
    return {
      ok: false,
      message: `Catalog already has ${count} products. Pass force=true to replace (not exposed in UI).`,
    };
  }

  if (force && (count ?? 0) > 0) {
    const { error: delErr } = await admin.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (delErr) throw new Error(delErr.message);
  }

  const productRows = SEED_CATALOG_PRODUCTS.map((p) => {
    const { createdAt, ...rest } = p;
    return mapProductToDb({ ...rest, createdAt });
  });

  const { error: pErr } = await admin.from("products").insert(productRows);
  if (pErr) throw new Error(pErr.message);

  const { count: tCount } = await admin.from("testimonials").select("*", { count: "exact", head: true });
  if ((tCount ?? 0) === 0) {
    const { error: tErr } = await admin.from("testimonials").insert(
      DEFAULT_TESTIMONIALS.map(({ id: _id, ...t }) => t)
    );
    if (tErr) throw new Error(tErr.message);
  }

  const { error: sErr } = await admin.from("site_settings").upsert({
    id: 1,
    ...mapSiteSettingsToDb(defaultSiteSettings),
  });
  if (sErr) throw new Error(sErr.message);

  revalidateStore();
  return { ok: true, message: `Seeded ${productRows.length} products.` };
}

export async function checkIsAdmin(): Promise<boolean> {
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}
