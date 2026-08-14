"use client";

import Link from "next/link";
import { ChatCircleDots, PaperPlaneTilt } from "@phosphor-icons/react";
import { useState } from "react";

function dateLabel(value) {
  return value ? value.slice(0, 10) : "";
}

export function ArticleComments({ slug, initialComments = [], signedIn = false }) {
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState("");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState(null);
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

  return <section className="article-comments" id="comments" aria-labelledby="comments-title">
    <header className="comment-heading"><div><p>阅读留言</p><h2 id="comments-title">评论 <span>{comments.length}</span></h2></div><ChatCircleDots size={30} weight="duotone" aria-hidden="true" /></header>
    {signedIn ? <form className="comment-form" onSubmit={submitComment}>
      <label htmlFor="comment-body">留下你的想法</label>
      <textarea id="comment-body" value={body} onChange={(event) => setBody(event.target.value)} maxLength={1000} required placeholder="欢迎交流文章里的想法。评论将立即公开。" />
      <div className="comment-form-actions"><small>{body.length} / 1000 · 每分钟最多一条</small><button className="primary-button" type="submit" disabled={pending}>{pending ? "正在发布…" : <><PaperPlaneTilt size={18} />发布评论</>}</button></div>
    </form> : <div className="comment-login"><p>登录后即可参与讨论。邮箱密码和 GitHub 账号都可以使用。</p><Link className="secondary-button" href={loginHref}>登录后评论</Link></div>}
    {status && <p className={`comment-message ${status.kind}`} role="status">{status.text}</p>}
    <div className="comment-list" aria-live="polite">
      {comments.length ? comments.map((comment) => <article className="comment-card" key={comment.id}><header><strong>{comment.authorName}</strong><time dateTime={comment.createdAt}>{dateLabel(comment.createdAt)}</time></header><p>{comment.body}</p></article>) : <p className="comment-empty">还没有评论。第一条想法，会让这篇文章多一个继续学习的方向。</p>}
    </div>
  </section>;
}
