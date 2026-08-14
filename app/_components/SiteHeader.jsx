"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { navigation } from "../_data/site";
import { searchItems } from "../_data/search";
import { AuthMenu } from "./AuthMenu";
import { ThemeToggle } from "./ThemeToggle";
import { PixelPlayer } from "./PixelPlayer";

function SearchPanel({ open, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const normalized = query.trim().toLowerCase();
  const localResults = normalized
    ? searchItems.filter((item) =>
        [item.title, item.description, ...item.tags, ...item.keywords]
          .join(" ")
          .toLowerCase()
          .includes(normalized),
      )
    : searchItems.slice(0, 6);
  const [remoteResults, setRemoteResults] = useState([]);
  const results = normalized && remoteResults.length ? remoteResults : localResults;

  useEffect(() => {
    if (!normalized) { setRemoteResults([]); return; }
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(normalized)}`, { signal: controller.signal });
        if (response.ok) setRemoteResults((await response.json()).results || []);
      } catch (error) { if (error.name !== "AbortError") setRemoteResults([]); }
    }, 180);
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [normalized]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleDialogKeys = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll('input, button, a[href]');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleDialogKeys);
    return () => {
      document.removeEventListener("keydown", handleDialogKeys);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="search-backdrop" role="presentation" onMouseDown={onClose}>
      <section ref={panelRef} className="search-panel" role="dialog" aria-modal="true" aria-label="全站搜索" onMouseDown={(event) => event.stopPropagation()}>
        <div className="search-input-row">
          <MagnifyingGlass size={22} aria-hidden="true" />
          <label className="sr-only" htmlFor="site-search">搜索文章和项目</label>
          <input id="site-search" ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索文章、项目或标签…" />
          <button className="icon-button" type="button" onClick={onClose} aria-label="关闭搜索"><X size={18} /></button>
        </div>
        <p className="search-hint">{query ? `找到 ${results.length} 项结果` : "最近内容"}</p>
        <div className="search-results">
          {results.map((item) => (
            <Link href={item.href} key={`${item.type}-${item.href}`} onClick={onClose}>
              <span>{item.type}</span><strong>{item.title}</strong><p>{item.description}</p>
            </Link>
          ))}
          {!results.length && <div className="empty-state"><strong>没有找到相关内容</strong><p>换一个关键词，或清除输入后浏览最近内容。</p><button type="button" onClick={() => setQuery("")}>清除搜索</button></div>}
        </div>
      </section>
    </div>
  );
}

export function SiteHeader({ authConfigured = false }) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const triggerRef = useRef(null);
  const closeSearch = () => {
    setSearchOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };
  useEffect(() => {
    const openSearch = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", openSearch);
    return () => document.removeEventListener("keydown", openSearch);
  }, []);
  return (
    <>
      <header className="site-header">
        <nav className="site-nav" aria-label="主导航">
          <div className="brand"><PixelPlayer className="brand-player" compact /><Link className="brand-link" href="/" aria-label="返回首页"><span className="brand-wordmark">Zhuo</span><small>个人档案</small></Link></div>
          <div className="nav-links">
            {navigation.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return <Link href={item.href} key={item.href} aria-current={active ? "page" : undefined}>{item.label}</Link>;
            })}
          </div>
          <div className="nav-actions"><button ref={triggerRef} className="search-trigger" type="button" onClick={() => setSearchOpen(true)} aria-haspopup="dialog" aria-label="打开全站搜索"><MagnifyingGlass size={18} /><span>搜索</span><kbd>Ctrl K</kbd></button><ThemeToggle /><AuthMenu configured={authConfigured} /></div>
        </nav>
        <div className="pixel-statusbar" aria-label="网站状态"><div><span>● 在线存档</span><span>AI · CV · SOFTWARE</span><span>点击角色可以运球</span><span>记录正在持续更新</span><span aria-hidden="true">● 在线存档</span><span aria-hidden="true">AI · CV · SOFTWARE</span><span aria-hidden="true">点击角色可以运球</span><span aria-hidden="true">记录正在持续更新</span></div></div>
      </header>
      <SearchPanel open={searchOpen} onClose={closeSearch} />
    </>
  );
}
