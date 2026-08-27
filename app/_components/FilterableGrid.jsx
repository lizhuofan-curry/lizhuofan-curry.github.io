"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function FilterableGrid({ items, type }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const paramQuery = params.get("q") || "";
  const [queryDraft, setQueryDraft] = useState({ value: paramQuery, source: paramQuery });
  const query = queryDraft.source === paramQuery ? queryDraft.value : paramQuery;
  const isComposing = useRef(false);
  const tag = params.get("tag") || "全部";
  const tags = ["全部", ...new Set(items.flatMap((item) => [item.category, ...item.tags]))];
  const filtered = useMemo(() => items.filter((item) => {
    const haystack = [item.title, item.description || item.summary, item.category, ...item.tags].join(" ").toLowerCase();
    return (!query || haystack.includes(query.toLowerCase())) && (tag === "全部" || item.category === tag || item.tags.includes(tag));
  }), [items, query, tag]);
  const update = useCallback((name, value) => { const next = new URLSearchParams(params.toString()); value && value !== "全部" ? next.set(name, value) : next.delete(name); router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false }); }, [params, pathname, router]);

  useEffect(() => {
    if (isComposing.current || query === paramQuery) return;
    const timeout = window.setTimeout(() => update("q", query), 300);
    return () => window.clearTimeout(timeout);
  }, [query, paramQuery, update]);

  function clearFilters() {
    setQueryDraft({ value: "", source: paramQuery });
    router.replace(pathname, { scroll: false });
  }

  return <>
    <div className="filter-bar"><label><span>搜索{type}</span><input value={query} onChange={(event) => setQueryDraft({ value: event.target.value, source: paramQuery })} onCompositionStart={() => { isComposing.current = true; }} onCompositionEnd={(event) => { isComposing.current = false; setQueryDraft({ value: event.currentTarget.value, source: paramQuery }); update("q", event.currentTarget.value); }} placeholder={`输入${type}标题或关键词`} autoComplete="off" spellCheck={false} /></label><button type="button" onClick={clearFilters} disabled={!query && tag === "全部"}>清除筛选</button></div>
    <div className="tag-list" role="group" aria-label={`${type}标签`}>{tags.map((item) => <button type="button" className={tag === item ? "active" : ""} aria-pressed={tag === item} onClick={() => update("tag", item)} key={item}>{item}</button>)}</div>
    <p className="result-count" role="status">显示 {filtered.length} / {items.length} 项</p>
    <div className={`content-grid ${type === "项目" ? "project-listing" : ""}`}>
      {filtered.map((item, index) => <Link href={`/${type === "项目" ? "projects" : "articles"}/${item.slug}`} className="content-card" key={item.slug}><span className="card-index">{String(index + 1).padStart(2, "0")}</span><p className="card-meta">{item.category} / {item.readingTime || item.signal}</p><h2>{item.title}</h2><p>{item.description || item.summary}</p>{type === "文章" && <p className="card-engagement">观看 {item.viewCount || 0} / 点赞 {item.likeCount || 0}</p>}<div className="card-tags">{item.tags.slice(0, 4).map((itemTag) => <span key={itemTag}>{itemTag}</span>)}</div><strong>打开{type} <span aria-hidden="true">↗</span></strong></Link>)}
      {!filtered.length && <div className="empty-state grid-empty"><strong>没有符合条件的{type}</strong><p>清除筛选，或换一个关键词继续寻找。</p><button type="button" onClick={clearFilters}>查看全部</button></div>}
    </div>
  </>;
}
