"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { navigation } from "../_data/site";
import { searchItems } from "../_data/search";
import { ThemeToggle } from "./ThemeToggle";

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
  const requestKey = `${open ? "open" : "closed"}:${normalized}`;
  const [remoteResults, setRemoteResults] = useState({ key: "", items: [] });
  const results = remoteResults.key === requestKey && remoteResults.items.length ? remoteResults.items : localResults;

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const q = normalized ? `?q=${encodeURIComponent(normalized)}` : "";
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search${q}`, { signal: controller.signal });
        if (response.ok) setRemoteResults({ key: requestKey, items: (await response.json()).results || [] });
      } catch (error) { if (error.name !== "AbortError") setRemoteResults({ key: requestKey, items: [] }); }
    }, normalized ? 180 : 0);
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [normalized, open, requestKey]);

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

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
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

  if (isHome) {
    return <SearchPanel open={searchOpen} onClose={closeSearch} />;
  }

  return (
    <>
      <header className="site-header">
        <nav className="site-nav" aria-label="主导航">
          <Link className="nav-brand" href="/" aria-label="返回首页">
            <Image src="/doraemon-pixel-guide.png" alt="" width={32} height={32} className="nav-avatar" />
            <span className="nav-name">Zhuo</span>
          </Link>
          <div className="nav-links">
            {navigation.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return <Link href={item.href} key={item.href} className={`menu-item${active ? " active" : ""}`} aria-current={active ? "page" : undefined}>{item.label}</Link>;
            })}
          </div>
          <div className="nav-actions">
            <button ref={triggerRef} className="search-trigger" type="button" onClick={() => setSearchOpen(true)} aria-haspopup="dialog" aria-label="打开全站搜索"><MagnifyingGlass size={18} /><span>搜索</span><kbd>Ctrl K</kbd></button>
            <ThemeToggle />
          </div>
        </nav>
      </header>
      <SearchPanel open={searchOpen} onClose={closeSearch} />
    </>
  );
}
