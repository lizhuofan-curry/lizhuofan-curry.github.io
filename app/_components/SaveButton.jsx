"use client";

import Link from "next/link";
import { BookmarkSimple } from "@phosphor-icons/react";
import { useState, useSyncExternalStore } from "react";
import {
  decodeSavedItems,
  getSavedItemsServerSnapshot,
  getSavedItemsSnapshot,
  savedItemKey,
  subscribeToSavedItems,
  toggleSavedItem,
} from "../../lib/saved-items.client";

export function SaveButton({ kind, slug, title }) {
  const snapshot = useSyncExternalStore(subscribeToSavedItems, getSavedItemsSnapshot, getSavedItemsServerSnapshot);
  const state = decodeSavedItems(snapshot);
  const [message, setMessage] = useState("");
  const saved = state.items.some((item) => savedItemKey(item) === `${kind}:${slug}`);
  const loading = state.status === "loading";
  const unavailable = state.status === "unavailable";

  function toggle() {
    const result = toggleSavedItem(kind, slug);
    if (!result.ok) {
      setMessage("当前浏览器未开放本地存储，暂时无法收藏。");
      return;
    }
    setMessage(result.saved ? `已收藏《${title}》。` : `已从收藏移除《${title}》。`);
  }

  return (
    <div className="save-control">
      <button className={`save-button${saved ? " is-saved" : ""}`} type="button" onClick={toggle} aria-pressed={saved} disabled={loading || unavailable}>
        <BookmarkSimple size={19} weight={saved ? "fill" : "regular"} aria-hidden="true" />
        <span>{loading ? "读取收藏" : unavailable ? "收藏不可用" : saved ? "已收藏" : "收藏"}</span>
      </button>
      {!loading && <Link className="save-view-link" href="/saved">查看我的收藏</Link>}
      <span className="sr-only" role="status">{message}</span>
    </div>
  );
}
