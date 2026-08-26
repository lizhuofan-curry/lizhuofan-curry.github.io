"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "zhuo-presence-session";
const HEARTBEAT_MS = 45_000;

function sessionId() {
  try {
    const saved = window.sessionStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    const next = crypto.randomUUID();
    window.sessionStorage.setItem(STORAGE_KEY, next);
    return next;
  } catch {
    return crypto.randomUUID();
  }
}

/**
 * 首页名片卡下方的「N 人正在做客」计数。与 OnlinePresence 共用同一个
 * sessionStorage 会话 ID，服务端按 HMAC 去重，不会重复计数。
 * 数据库或密钥不可用时静默隐藏，不影响页面。
 */
export function GuestCount() {
  const [onlineCount, setOnlineCount] = useState(null);
  const idRef = useRef(null);

  useEffect(() => {
    idRef.current = sessionId();
    let cancelled = false;

    async function heartbeat() {
      try {
        const response = await fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: idRef.current }),
          cache: "no-store",
        });
        if (!response.ok) return;
        const payload = await response.json();
        if (!cancelled && payload.configured) setOnlineCount(payload.onlineCount);
      } catch {
        // 在线状态是可选信号：失败时保持隐藏。
      }
    }

    heartbeat();
    const timer = window.setInterval(heartbeat, HEARTBEAT_MS);
    const onVisible = () => { if (document.visibilityState === "visible") heartbeat(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  if (onlineCount === null) return null;
  return (
    <p aria-live="polite">👀 <b>{onlineCount}</b> 人正在做客</p>
  );
}
