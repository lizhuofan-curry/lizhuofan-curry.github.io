"use client";

import Link from "next/link";
import { Check, ChatCircleDots, PencilSimple, PaperPlaneTilt, Trash, X } from "@phosphor-icons/react";
import { useState } from "react";

function dateLabel(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("zh-CN", { timeZone: "Asia/Shanghai", dateStyle: "medium", timeStyle: "short", hour12: false }).format(new Date(value));
}

export function ArticleComments({ slug, initialComments = [], signedIn = false }) {
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState("");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingBody, setEditingBody] = useState("");
  const [actionPending, setActionPending] = useState(null);
  const loginHref = `/login?next=${encodeURIComponent(`/articles/${slug}#comments`)}`;

  async function submitComment(event) {
    event.preventDefault();
    if (!body.trim()) return;
    setPending(true);
    setStatus(null);
    try {
      const response = await fetch(`/api/articles/${slug}/comments`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus({ kind: "error", text: data.error || "评论暂时无法发布，请稍后再试。" });
        return;
      }
      setComments((current) => [...current, data.comment]);
      setBody("");
      setStatus({ kind: "success", text: "评论已公开发布。" });
    } catch {
      setStatus({ kind: "error", text: "网络暂时不可用，请稍后再试。" });
    } finally {
      setPending(false);
    }
  }

  async function changeComment(id, method, nextBody) {
    setActionPending(id);
    setStatus(null);
    try {
      const response = await fetch(`/api/articles/${slug}/comments/${id}`, {
        method,
        headers: method === "PATCH" ? { "content-type": "application/json" } : undefined,
        body: method === "PATCH" ? JSON.stringify({ body: nextBody }) : undefined,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus({ kind: "error", text: data.error || "操作暂时无法完成，请稍后再试。" });
        return false;
      }
      if (method === "DELETE") {
        setComments((current) => current.filter((comment) => comment.id !== id));
        setStatus({ kind: "success", text: "评论已删除。" });
      } else {
        setComments((current) => current.map((comment) => comment.id === id ? data.comment : comment));
        setEditingId(null);
        setEditingBody("");
        setStatus({ kind: "success", text: "评论已更新。" });
      }
      return true;
    } catch {
      setStatus({ kind: "error", text: "网络暂时不可用，请稍后再试。" });
      return false;
    } finally {
      setActionPending(null);
    }
  }

  async function deleteComment(id) {
    if (!window.confirm("确定删除这条评论吗？删除后将不再在公开页面显示。")) return;
    await changeComment(id, "DELETE");
  }

  return <section className="article-comments" id="comments" aria-labelledby="comments-title">
    <header className="comment-heading"><div><p>阅读留言</p><h2 id="comments-title">评论 <span>{comments.length}</span></h2></div><ChatCircleDots size={30} weight="duotone" aria-hidden="true" /></header>
    {signedIn ? <form className="comment-form" onSubmit={submitComment}>
      <label htmlFor="comment-body">留下你的想法</label>
      <textarea id="comment-body" value={body} onChange={(event) => setBody(event.target.value)} maxLength={1000} required placeholder="欢迎交流文章里的想法。评论将立即公开。" />
      <div className="comment-form-actions"><small>{body.length} / 1000 · 每分钟最多一条</small><button className="primary-button" type="submit" disabled={pending}>{pending ? "正在发布…" : <><PaperPlaneTilt size={18} />发布评论</>}</button></div>
    </form> : <div className="comment-login"><p>登录后即可参与讨论。邮箱密码和 GitHub 账号都可以使用。</p><Link className="secondary-button" href={loginHref}>登录后评论</Link></div>}
    {status && <p className={`comment-message ${status.kind}`} role="status">{status.text}</p>}
    <div className="comment-list" aria-live="polite">
      {comments.length ? comments.map((comment) => <article className="comment-card" key={comment.id}><header><strong>{comment.authorName}</strong><time dateTime={comment.createdAt}>发布于 {dateLabel(comment.createdAt)}</time></header>{editingId === comment.id ? <form className="comment-edit-form" onSubmit={(event) => { event.preventDefault(); changeComment(comment.id, "PATCH", editingBody); }}><label className="sr-only" htmlFor={`comment-edit-${comment.id}`}>修改评论</label><textarea id={`comment-edit-${comment.id}`} value={editingBody} onChange={(event) => setEditingBody(event.target.value)} maxLength={1000} required /><div><small>{editingBody.length} / 1000</small><span><button type="button" className="comment-text-button" onClick={() => { setEditingId(null); setEditingBody(""); }} disabled={actionPending === comment.id}><X size={16} />取消</button><button type="submit" className="comment-text-button" disabled={actionPending === comment.id || !editingBody.trim()}><Check size={16} />保存</button></span></div></form> : <><p>{comment.body}</p>{comment.canManage && <div className="comment-owner-actions"><button type="button" className="comment-text-button" onClick={() => { setEditingId(comment.id); setEditingBody(comment.body); }} disabled={Boolean(actionPending)}><PencilSimple size={16} />修改</button><button type="button" className="comment-text-button is-danger" onClick={() => deleteComment(comment.id)} disabled={Boolean(actionPending)}><Trash size={16} />删除</button></div>}</>}</article>) : <p className="comment-empty">还没有评论。第一条想法，会让这篇文章多一个继续学习的方向。</p>}
    </div>
  </section>;
}
