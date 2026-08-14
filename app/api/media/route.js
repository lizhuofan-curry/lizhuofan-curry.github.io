import { randomUUID } from "node:crypto";
import { getRoleForUser, getSessionFromHeaders } from "../../../lib/auth";
import { isDatabaseConfigured, query } from "../../../lib/db";
import { allowedImageTypes, createMediaStorage } from "../../../lib/media-storage";

function matchesSignature(type, bytes) {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  if (type === "image/gif") return bytes.subarray(0, 6).toString("ascii") === "GIF87a" || bytes.subarray(0, 6).toString("ascii") === "GIF89a";
  if (type === "image/webp") return bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  return false;
}

export async function POST(request) {
  const session = await getSessionFromHeaders(request.headers);
  if (!session || await getRoleForUser(session.user.id) !== "admin") return Response.json({ error: "没有上传权限" }, { status: 403 });
  const storage = createMediaStorage();
  if (!storage || !isDatabaseConfigured()) return Response.json({ error: "媒体存储尚未配置" }, { status: 503 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || !allowedImageTypes.has(file.type)) return Response.json({ error: "仅支持 JPEG、PNG、WebP 和 GIF" }, { status: 400 });
  if (file.size <= 0 || file.size > 5 * 1024 * 1024) return Response.json({ error: "图片大小必须在 5MB 以内" }, { status: 400 });
  const bytes = Buffer.from(await file.arrayBuffer());
  if (!matchesSignature(file.type, bytes)) return Response.json({ error: "文件内容与图片类型不一致" }, { status: 400 });
  const extension = allowedImageTypes.get(file.type);
  const key = `articles/${new Date().getUTCFullYear()}/${randomUUID()}.${extension}`;
  const publicUrl = await storage.put(key, bytes, file.type);
  await query(`insert into media_assets (storage_key, public_url, mime_type, size_bytes, uploader_id) values ($1, $2, $3, $4, $5)`, [key, publicUrl, file.type, file.size, session.user.id]);
  return Response.json({ key, publicUrl });
}
