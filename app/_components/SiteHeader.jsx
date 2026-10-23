"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation } from "../_data/site";
import { searchItems } from "../_data/search";
import { ThemeToggle } from "./ThemeToggle";
import { Icon } from "./Icon";

export function SiteHeader() {
  const pathname = usePathname();
  const dialogRef = useRef(null), inputRef = useRef(null), triggerRef = useRef(null), previousFocus = useRef(null);
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLocaleLowerCase();
  const results = (normalized ? searchItems.filter(item => [item.title, item.description, ...item.tags, ...item.keywords].join(" ").toLocaleLowerCase().includes(normalized)) : searchItems.filter(item => !item.archived)).slice(0, 12);
  function open() { previousFocus.current = document.activeElement; dialogRef.current?.showModal(); document.body.style.overflow = "hidden"; inputRef.current?.focus(); }
  function close() { dialogRef.current?.close(); }
  function closed() { document.body.style.overflow = ""; (previousFocus.current instanceof HTMLElement ? previousFocus.current : triggerRef.current)?.focus(); }
  useEffect(() => {
    const shortcut = (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); if (dialogRef.current?.open) close(); else open(); } };
    document.addEventListener("keydown", shortcut);
    return () => { document.removeEventListener("keydown", shortcut); document.body.style.overflow = ""; };
  }, []);
  return <>
    <header className="site-header"><div className="header-inner">
      <a href="/" className="brand" aria-label="Zhuo 首页">zhuo<span>.</span></a>
      <nav className="nav-links" aria-label="主导航">{navigation.map(item => { const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href); return <a href={item.href} key={item.href} aria-current={active ? "page" : undefined} className={active ? "active" : ""}>{item.label}</a>; })}</nav>
      <div className="nav-actions"><button ref={triggerRef} className="icon-button" type="button" onClick={open} aria-label="搜索作品和笔记" aria-haspopup="dialog"><Icon name="search"/></button><ThemeToggle/></div>
    </div></header>
    <dialog ref={dialogRef} className="search-dialog" aria-labelledby="search-heading" onClose={closed} onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div className="search-inner"><div className="dialog-heading"><h2 id="search-heading">找一点感兴趣的</h2><button className="icon-button" aria-label="关闭搜索" onClick={close}><Icon name="close"/></button></div>
      <label className="search-field"><Icon name="search"/><span className="sr-only">关键词</span><input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="试试“AI”“问渠”或“Agent”…" autoComplete="off"/></label>
      <p className="search-hint" aria-live="polite">{normalized ? `找到 ${results.length} 项内容` : "可以从这些内容开始"}</p>
      <div className="search-results">{results.map(item => <a href={item.href} key={item.href}><span className="small-label">{item.type}</span><strong>{item.title}</strong><p>{item.description}</p></a>)}</div>
      {!results.length && <div className="empty-state"><Icon name="search" size={30}/><h3>暂时没有找到</h3><p>试试更短的关键词，或者重新看看全部内容。</p><button className="button secondary" onClick={() => { setQuery(""); inputRef.current?.focus(); }}>清除关键词</button></div>}
      <div className="search-bottom">搜索本站公开内容 <span><kbd>Esc</kbd> 关闭</span></div></div>
    </dialog>
  </>;
}
