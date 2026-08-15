"use client";

import Link from "next/link";
import { Trash } from "@phosphor-icons/react";
import { useState } from "react";

function dateTimeLabel(value) {
  return new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", dateStyle: "medium", timeStyle: "short", hour12: false }).format(new Date(value));
}

export function StudioComments({ initialComments = [] }) {
  const [comments, setComments] = useState(initialComments);
  const [pendingId, setPendingId] = useState(null);
  const [status, setStatus] = useState(null);

  async function removeComment(id) {
    if (!window.confirm("删除后将不再在公开文章页显示。这条评论仍会保留后台记录，确定继续吗？")) return;
    setPendingId(id);
    setStatus(null);
    try {
      const response = await fetch(`/api/studio/comments/${id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus({ kind: "error", text: data.error || "删除失败，请稍后再试。" });
        return;
      }
      setComments((current) => current.map((comment) => comment.id === id ? { ...comment, deletedAt: new Date().toISOString() } : comment));
      setStatus({ kind: "success", text: "评论已从公开文章页移除。" });
    } catch {
      setStatus({ kind: "error", text: "网络暂时不可用，请稍后再试。" });
    } finally {
      setPendingId(null);
    }
  }

  return <main id="main-content" className="studio-page studio-comments-page"><header><p>评论管理</p><h1>阅读公开讨论，必要时及时移除不合适的内容。</h1></header>{status && <p className={`comment-message ${status.kind}`} role="status">{status.text}</p>}<div className="studio-comment-list">{comments.length ? comments.map((comment) => <article className={`studio-comment-item${comment.deletedAt ? " is-deleted" : ""}`} key={comment.id}><div className="studio-comment-meta"><div><strong>{comment.authorName}</strong><span>{dateTimeLabel(comment.createdAt)}</span></div><Link href={`/articles/${comment.article.slug}`}>{comment.article.title || comment.article.slug}</Link></div><p>{comment.body}</p>{comment.deletedAt ? <small>已删除，不会在公开页面显示。</small> : <button className="danger-button" type="button" onClick={() => removeComment(comment.id)} disabled={pendingId === comment.id}>{pendingId === comment.id ? "正在删除…" : <><Trash size={17} />删除评论</>}</button>}</article>) : <section className="setup-notice"><h2>还没有评论</h2><p>公开文章收到评论后，会在这里统一显示。</p></section>}</div></main>;
}
