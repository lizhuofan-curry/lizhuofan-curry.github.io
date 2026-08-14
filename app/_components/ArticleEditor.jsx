"use client";

import { useState } from "react";
import { MarkdownArticle } from "./MarkdownArticle";

export function ArticleEditor({ article, saveDraft, publishArticle }) {
  const [body, setBody] = useState(article?.body_markdown || "");
  return <form className="editor-form"><input type="hidden" name="id" defaultValue={article?.id || ""} /><div className="editor-fields"><label>标题<input name="title" required minLength={2} maxLength={120} defaultValue={article?.title || ""} /></label><div className="editor-row"><label>Slug<input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" defaultValue={article?.slug || ""} /></label><label>分类<input name="category" required defaultValue={article?.category || ""} /></label></div><label>摘要<textarea name="description" required minLength={10} maxLength={280} rows={3} defaultValue={article?.description || ""} /></label><label>标签<input name="tags" defaultValue={(article?.tags || []).join(", ")} placeholder="PyTorch, 调试, 证据" /></label><label>封面地址<input name="coverUrl" type="url" defaultValue={article?.cover_url || ""} /></label></div><div className="editor-split"><label className="markdown-input">Markdown 正文<textarea name="body" required minLength={80} value={body} onChange={(event) => setBody(event.target.value)} /></label><section className="markdown-preview"><span>实时预览</span><div className="prose"><MarkdownArticle>{body || "在左侧开始写作。"}</MarkdownArticle></div></section></div><div className="editor-actions"><button className="secondary-button" formAction={saveDraft}>保存草稿</button><button className="primary-button" formAction={publishArticle}>发布文章</button></div></form>;
}
