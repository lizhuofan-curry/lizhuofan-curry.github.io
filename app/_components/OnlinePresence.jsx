"use client";

import { Broadcast, UsersThree } from "@phosphor-icons/react";
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

export function OnlinePresence() {
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
        // The indicator is optional: never block the page if the heartbeat fails.
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

  return <div className="online-presence" aria-live="polite" title="90 秒内有活动的匿名访问会话；不记录 IP 或身份信息。">
    <span className="online-presence-signal" aria-hidden="true"><Broadcast size={15} /></span>
    <span><UsersThree size={16} aria-hidden="true" /> 当前在线</span>
    <strong>{onlineCount === null ? "…" : onlineCount}</strong>
  </div>;
}
