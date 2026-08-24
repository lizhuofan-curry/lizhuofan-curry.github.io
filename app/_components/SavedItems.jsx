"use client";

import Link from "next/link";
import { ArrowUpRight, BookmarkSimple, Trash } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  clearSavedItems,
  decodeSavedItems,
  getSavedItemsServerSnapshot,
  getSavedItemsSnapshot,
  removeSavedItem,
  savedItemKey,
  subscribeToSavedItems,
} from "../../lib/saved-items.client";

const formatter = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function SavedItems({ catalog }) {
  const snapshot = useSyncExternalStore(subscribeToSavedItems, getSavedItemsSnapshot, getSavedItemsServerSnapshot);
  const state = decodeSavedItems(snapshot);
  const [message, setMessage] = useState("");
  const [confirmingClear, setConfirmingClear] = useState(false);
  const emptyHeadingRef = useRef(null);
  const removeButtonRefs = useRef(new Map());
  const pendingFocusRef = useRef(undefined);
  const clearTriggerRef = useRef(null);
  const clearCancelRef = useRef(null);
  const restoreClearTriggerRef = useRef(false);
  const catalogByKey = useMemo(() => new Map(catalog.map((item) => [`${item.kind}:${item.slug}`, item])), [catalog]);
  const entries = state.items.map((record) => ({ record, item: catalogByKey.get(savedItemKey(record)) || null }));

  useEffect(() => {
    if (pendingFocusRef.current === undefined) return;
    const nextKey = pendingFocusRef.current;
    pendingFocusRef.current = undefined;
    if (nextKey) removeButtonRefs.current.get(nextKey)?.focus();
    else emptyHeadingRef.current?.focus();
  }, [snapshot]);

  useEffect(() => {
    if (confirmingClear) clearCancelRef.current?.focus();
    else if (restoreClearTriggerRef.current) {
      restoreClearTriggerRef.current = false;
      clearTriggerRef.current?.focus();
    }
  }, [confirmingClear]);

  function removeEntry(entry, index) {
    const nextEntry = entries[index + 1] || entries[index - 1];
    pendingFocusRef.current = nextEntry ? savedItemKey(nextEntry.record) : null;
    if (!removeSavedItem(entry.record.kind, entry.record.slug)) {
      pendingFocusRef.current = undefined;
      setMessage("暂时无法修改本机收藏。");
      return;
    }
    setMessage(entry.item ? `已移除《${entry.item.title}》。` : "已移除失效收藏记录。");
  }

  function clearAll() {
    pendingFocusRef.current = null;
    if (!clearSavedItems()) {
      pendingFocusRef.current = undefined;
      setMessage("暂时无法清空本机收藏。");
      return;
    }
    setConfirmingClear(false);
    setMessage("已清空全部收藏。");
  }

  function openClearConfirmation() {
    restoreClearTriggerRef.current = false;
    setConfirmingClear(true);
  }

  function cancelClear() {
    restoreClearTriggerRef.current = true;
    setConfirmingClear(false);
  }

  if (state.status === "loading") {
    return <section className="saved-state" aria-busy="true"><BookmarkSimple size={28} aria-hidden="true" /><h2>正在读取此浏览器的收藏</h2><p>收藏记录不会上传到服务器。</p></section>;
  }

  if (state.status === "unavailable") {
    return <section className="saved-state is-error"><h2>当前无法读取本机收藏</h2><p>浏览器可能关闭了本地存储。你仍然可以正常阅读文章和项目。</p><Link href="/articles">浏览文章</Link></section>;
  }

  if (state.status === "invalid") {
    return <section className="saved-state is-error"><h2>收藏记录格式无效</h2><p>可以重置本机记录后重新收藏内容。</p><button className="danger-button" type="button" onClick={clearAll}>重置收藏记录</button><p className="sr-only" role="status">{message}</p></section>;
  }

  if (!entries.length) {
    return <section className="saved-state"><BookmarkSimple size={30} aria-hidden="true" /><h2 ref={emptyHeadingRef} tabIndex={-1}>还没有收藏内容</h2><p>在文章或项目详情页点按“收藏”，它们会出现在这里。</p><div className="saved-empty-actions"><Link className="primary-button" href="/articles">浏览文章</Link><Link className="secondary-button" href="/projects">浏览项目</Link></div><p className="sr-only" role="status">{message}</p></section>;
  }

  return (
    <section className="saved-collection" aria-labelledby="saved-list-title">
      <header className="saved-collection-head">
        <div><p className="section-kicker">LOCAL ARCHIVE</p><h2 id="saved-list-title">我的收藏</h2><p>已收藏 {entries.length} 项 · 仅保存在当前浏览器</p></div>
        {!confirmingClear ? <button ref={clearTriggerRef} className="danger-button" type="button" onClick={openClearConfirmation}><Trash size={17} aria-hidden="true" />清空全部</button> : <div className="saved-clear-confirm" role="group" aria-labelledby="saved-clear-prompt"><p id="saved-clear-prompt">确定清空全部 {entries.length} 项收藏吗？此操作无法撤销。</p><div><button className="danger-button" type="button" onClick={clearAll} aria-describedby="saved-clear-prompt">确认清空</button><button ref={clearCancelRef} className="secondary-button" type="button" onClick={cancelClear} aria-describedby="saved-clear-prompt">取消</button></div></div>}
      </header>
      {state.invalidCount > 0 && <p className="saved-notice">已忽略 {state.invalidCount} 条无法识别的本机记录。</p>}
      <ol className="saved-list">
        {entries.map((entry, index) => {
          const key = savedItemKey(entry.record);
          const typeLabel = entry.record.kind === "article" ? "文章" : "项目";
          return <li className={`saved-card${entry.item ? "" : " is-missing"}`} key={key}><span className="saved-card-index">{String(index + 1).padStart(2, "0")}</span><div className="saved-card-copy"><small>{typeLabel} · 收藏于 <time dateTime={entry.record.savedAt}>{formatter.format(new Date(entry.record.savedAt))}</time></small>{entry.item ? <><h3><Link className="saved-title-link" href={entry.item.href}>{entry.item.title} <ArrowUpRight size={20} aria-hidden="true" /></Link></h3><p>{entry.item.description}</p></> : <><h3>内容已下线或当前不可用</h3><p>记录仍保留在此浏览器中，你可以稍后再看或手动移除。</p></>}</div><button ref={(node) => { if (node) removeButtonRefs.current.set(key, node); else removeButtonRefs.current.delete(key); }} className="saved-remove" type="button" onClick={() => removeEntry(entry, index)} aria-label={entry.item ? `移除《${entry.item.title}》收藏` : `移除失效的${typeLabel}收藏`}><Trash size={18} aria-hidden="true" /><span>移除</span></button></li>;
        })}
      </ol>
      <p className="sr-only" role="status">{message}</p>
    </section>
  );
}
