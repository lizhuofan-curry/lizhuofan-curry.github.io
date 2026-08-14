"use client";

import { useState } from "react";

export function MediaUploader() {
  const [result, setResult] = useState(null);
  const [pending, setPending] = useState(false);
  async function upload(event) {
    event.preventDefault(); setPending(true); setResult(null);
    const response = await fetch("/api/media", { method: "POST", body: new FormData(event.currentTarget) });
    const data = await response.json(); setResult(response.ok ? data : { error: data.error || "上传失败" }); setPending(false);
  }
  return <form className="media-uploader surface-card" onSubmit={upload}><label>选择文章图片<input type="file" name="file" accept="image/jpeg,image/png,image/webp,image/gif" required /></label><p>支持 JPEG、PNG、WebP、GIF，单张不超过 5MB。</p><button className="primary-button" disabled={pending}>{pending ? "正在上传..." : "上传图片"}</button>{result?.publicUrl && <div className="upload-result"><strong>上传完成</strong><input value={result.publicUrl} readOnly onFocus={(event) => event.currentTarget.select()} /></div>}{result?.error && <p role="alert">{result.error}</p>}</form>;
}
