import { createClient } from "@supabase/supabase-js";

export const allowedImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

function createSupabaseStorage() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const bucket = process.env.SUPABASE_MEDIA_BUCKET || "article-media";
  const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return {
    async put(key, bytes, contentType) {
      const { error } = await client.storage.from(bucket).upload(key, bytes, {
        contentType,
        cacheControl: "31536000",
        upsert: false,
      });
      if (error) throw error;
      return client.storage.from(bucket).getPublicUrl(key).data.publicUrl;
    },
    async delete(key) {
      const { error } = await client.storage.from(bucket).remove([key]);
      if (error) throw error;
    },
    publicUrl(key) {
      return client.storage.from(bucket).getPublicUrl(key).data.publicUrl;
    },
  };
}

export function getMediaStorageDriver() {
  return process.env.MEDIA_STORAGE_DRIVER || "supabase";
}

export function isStorageConfigured() {
  return getMediaStorageDriver() === "supabase" && Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// This factory is the only storage dependency used by routes. Add an OSS
// implementation here later; callers keep the same put/delete/publicUrl contract.
export function createMediaStorage() {
  const driver = getMediaStorageDriver();
  if (driver === "supabase") return createSupabaseStorage();
  if (driver === "oss") throw new Error("MEDIA_STORAGE_DRIVER_OSS_NOT_IMPLEMENTED");
  throw new Error(`MEDIA_STORAGE_DRIVER_UNSUPPORTED: ${driver}`);
}
