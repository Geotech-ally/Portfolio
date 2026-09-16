import { supabase } from "@/lib/supabase";

/**
 * Buckets created by supabase/migrations/0003_storage.sql.
 * `resume` and `certificates` are private-by-default (signed URLs only);
 * the rest are public read, admin write (see storage RLS policies).
 */
export const STORAGE_BUCKETS = {
  projectImages: "project-images",
  blogImages: "blog-images",
  certificates: "certificates",
  resume: "resume",
  profile: "profile",
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const ALLOWED_DOCUMENT_TYPES = ["application/pdf"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024; // 10MB

export class UploadValidationError extends Error {}

/**
 * Validates MIME type + size *before* the file ever reaches the network,
 * and generates a collision-safe filename. This is a first line of
 * defense for UX only — Supabase Storage bucket policies and the bucket's
 * configured `allowed_mime_types` are the actual enforcement boundary,
 * since a client-side check can always be bypassed.
 */
export function validateUpload(file: File, kind: "image" | "document"): void {
  const allowed = kind === "image" ? ALLOWED_IMAGE_TYPES : ALLOWED_DOCUMENT_TYPES;
  const maxBytes = kind === "image" ? MAX_IMAGE_BYTES : MAX_DOCUMENT_BYTES;

  if (!allowed.includes(file.type)) {
    throw new UploadValidationError(`Unsupported file type: ${file.type || "unknown"}`);
  }
  if (file.size > maxBytes) {
    throw new UploadValidationError(`File exceeds the ${maxBytes / (1024 * 1024)}MB limit`);
  }
}

function safeFileName(originalName: string): string {
  const ext = originalName.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "bin";
  const random = crypto.randomUUID();
  return `${random}.${ext}`;
}

export async function uploadFile(
  bucket: StorageBucket,
  file: File,
  kind: "image" | "document",
  pathPrefix = ""
): Promise<string> {
  validateUpload(file, kind);
  const path = `${pathPrefix}${safeFileName(file.name)}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export function getPublicUrl(bucket: StorageBucket, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/** For private buckets (resume, certificates) — short-lived signed URL. */
export async function getSignedUrl(bucket: StorageBucket, path: string, expiresInSeconds = 300): Promise<string> {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresInSeconds);
  if (error) throw error;
  return data.signedUrl;
}
