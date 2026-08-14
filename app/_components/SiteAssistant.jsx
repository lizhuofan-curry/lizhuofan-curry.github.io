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
  const [reply, setReply] = useState("");
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("");
  const [position, setPosition] = useState(null);
  const dragRef = useRef(null);
  const triggerRef = useRef(null);
  const inputRef = useRef(null);

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

  const savePosition = (next) => {
    setPosition(next);
    try { localStorage.setItem(POSITION_KEY, JSON.stringify(next)); } catch {}
  };

  const handlePointerDown = (event) => {
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
    if (!drag.moved) {
      const nextAction = ["is-spinning", "is-jumping"][Math.floor(Math.random() * 2)];
      setAction(nextAction);
      window.setTimeout(() => setAction(""), 850);
      setOpen(true);
    }
  };

  const handlePointerCancel = () => { dragRef.current = null; };

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
    setReply("");
    setLinks([]);
    try {
      let sessionId = sessionStorage.getItem(SESSION_KEY);
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem(SESSION_KEY, sessionId);
      }
      const response = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question, pagePath: location.pathname, sessionId }) });
      const data = await response.json();
      setReply(cleanAnswer(data.answer || data.error));
      setLinks(Array.isArray(data.links) ? data.links.filter((link) => typeof link?.href === "string" && link.href.startsWith("/")) : []);
    } catch {
      setReply("网络暂时不可用，请稍后再试。");
    } finally {
      setLoading(false);
    }
  };

  return <aside className={`site-assistant ${action}`} style={position ? { left: position.x, top: position.y, right: "auto", bottom: "auto" } : undefined} aria-label="哆啦A梦导览员">
    <button ref={triggerRef} className="assistant-pet" type="button" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerEnd} onPointerCancel={handlePointerCancel} aria-label="拖动或打开哆啦A梦导览员" aria-expanded={open}>
      <Image src="/doraemon-pixel-guide.png" alt="" fill sizes="(max-width: 680px) 104px, 132px" priority />
      <span className="assistant-propeller" aria-hidden="true" />
    </button>
    {open && <section className="assistant-panel" role="dialog" aria-modal="false" aria-label="哆啦A梦导览">
      <header><div><small>网站导览</small><strong>哆啦A梦</strong></div><button type="button" onClick={() => setOpen(false)} aria-label="关闭对话">×</button></header>
      <p className="assistant-reply">{loading ? "正在整理站内信息…" : reply || "拖动我到屏幕任意位置。想了解 Zhuo、文章或项目，都可以问我。"}</p>
      {links.length > 0 && <nav className="assistant-links" aria-label="相关页面">{links.map((link) => <a key={link.href} href={link.href}>{cleanAnswer(link.title || link.href)}</a>)}</nav>}
      <form onSubmit={ask}><input ref={inputRef} value={text} onChange={(event) => setText(event.target.value)} placeholder="输入你的问题…" aria-label="问题" autoComplete="off" /><button disabled={loading || !text.trim()}>{loading ? "思考中…" : "发送"}</button></form>
      <footer><button type="button" onClick={resetPosition}>重置位置</button><span>按 Esc 关闭</span></footer>
    </section>}
  </aside>;
}
