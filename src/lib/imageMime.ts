const EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

/** Normalize browser / OS mime quirks for Supabase storage allowed_mime_types. */
export function resolveImageMime(file: File): string {
  const type = file.type?.toLowerCase().trim();
  if (type && ALLOWED.has(type)) {
    if (type === "image/jpg" || type === "image/pjpeg") return "image/jpeg";
    return type;
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_MIME[ext] ?? "";
}

export function isAllowedImageMime(mime: string): boolean {
  return Boolean(mime && (mime === "image/jpeg" || ALLOWED.has(mime)));
}
