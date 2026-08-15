"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const POSITION_KEY = "zhuo-web-guide-position";
const SESSION_KEY = "zhuo-web-guide-session";
const PET_WIDTH = 132;
const PET_HEIGHT = 156;
const MARGIN = 8;

function cleanAnswer(value) {
  return String(value || "暂时无法回答，请试试查看文章或项目页。")
    .replace(/[{}]/g, "")
    .replace(/\\(?:about|articles|projects|login|privacy)\b/gi, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function clampPosition(x, y) {
  return {
    x: Math.max(MARGIN, Math.min(x, window.innerWidth - PET_WIDTH - MARGIN)),
    y: Math.max(MARGIN, Math.min(y, window.innerHeight - PET_HEIGHT - MARGIN)),
  };
}

export function SiteAssistant() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([{ role: "assistant", content: "拖动我到屏幕任意位置。想了解 Zhuo、文章或项目，也可以问我学习和技术问题。", links: [] }]);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(null);
  const dragRef = useRef(null);
  const triggerRef = useRef(null);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(POSITION_KEY));
      if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) setPosition(clampPosition(saved.x, saved.y));
    } catch {}
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        requestAnimationFrame(() => triggerRef.current?.focus());
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    if (open) messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  const savePosition = (next) => {
    setPosition(next);
    try { localStorage.setItem(POSITION_KEY, JSON.stringify(next)); } catch {}
  };

  const handlePointerDown = (event) => {
    if (event.button > 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top, moved: false };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const moved = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 7;
    if (!moved && !drag.moved) return;
    drag.moved = true;
    savePosition(clampPosition(event.clientX - drag.offsetX, event.clientY - drag.offsetY));
  };

  const handlePointerEnd = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    if (!drag.moved) {
      setOpen(true);
    }
  };

  const handlePointerCancel = (event) => {
    dragRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const resetPosition = () => {
    setPosition(null);
    try { localStorage.removeItem(POSITION_KEY); } catch {}
  };

  const ask = async (event) => {
    event.preventDefault();
    const question = text.trim();
    if (!question || loading) return;
    setText("");
    setLoading(true);
    setMessages((current) => [...current, { role: "user", content: question, links: [] }]);
    try {
      let sessionId = sessionStorage.getItem(SESSION_KEY);
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem(SESSION_KEY, sessionId);
      }
      const response = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question, pagePath: location.pathname, sessionId }) });
      const data = await response.json();
      const nextLinks = Array.isArray(data.links) ? data.links.filter((link) => typeof link?.href === "string" && link.href.startsWith("/")) : [];
      setMessages((current) => [...current, { role: "assistant", content: cleanAnswer(data.answer || data.error), links: nextLinks }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: "网络暂时不可用，请稍后再试。", links: [] }]);
    } finally {
      setLoading(false);
    }
  };

  return <aside className="site-assistant" style={position ? { left: position.x, top: position.y, right: "auto", bottom: "auto" } : undefined} aria-label="哆啦A梦导览员">
    <button ref={triggerRef} className={`assistant-pet${open ? " is-open" : ""}`} type="button" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerEnd} onPointerCancel={handlePointerCancel} onDragStart={(event) => event.preventDefault()} aria-label="拖动或打开哆啦A梦导览员" aria-expanded={open}>
      <Image src="/doraemon-pixel-guide.png" alt="" fill sizes="(max-width: 680px) 104px, 132px" priority draggable={false} />
      <span className="assistant-shadow" aria-hidden="true" />
    </button>
    {open && <section className="assistant-panel" role="dialog" aria-modal="false" aria-label="哆啦A梦导览">
      <header><div><small>网站导览</small><strong>哆啦A梦</strong></div><button type="button" onClick={() => setOpen(false)} aria-label="关闭对话">×</button></header>
      <div className="assistant-messages" ref={messagesRef} aria-live="polite">{messages.map((message, index) => <article className={`assistant-message is-${message.role}`} key={`${message.role}-${index}`}><p>{message.content}</p>{message.links.length > 0 && <nav className="assistant-links" aria-label="相关页面">{message.links.map((link) => <a key={link.href} href={link.href}>{cleanAnswer(link.title || link.href)}</a>)}</nav>}</article>)}{loading && <article className="assistant-message is-assistant"><p>正在整理站内信息…</p></article>}</div>
      <form onSubmit={ask}><input ref={inputRef} value={text} onChange={(event) => setText(event.target.value)} placeholder="输入你的问题…" aria-label="问题" autoComplete="off" /><button disabled={loading || !text.trim()}>{loading ? "思考中…" : "发送"}</button></form>
      <footer><button type="button" onClick={resetPosition}>重置位置</button><span>按 Esc 关闭</span></footer>
    </section>}
  </aside>;
}
