import { createClient } from "@supabase/supabase-js";

export const allowedImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

export function isStorageConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function createMediaStorage() {
  if (!isStorageConfigured()) return null;
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
