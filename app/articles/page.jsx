import { Suspense } from "react";
import { FilterableGrid } from "../_components/FilterableGrid";
import { getPublishedArticles } from "../../lib/content";

export const metadata = { title: "文章", description: "关于调试、深度学习结构和实验的中文短文。", alternates: { canonical: "/articles" } };
export default async function ArticlesPage() { const articles = await getPublishedArticles(); return <main id="main-content" className="index-page page-shell"><header className="pixel-page-hero surface-card"><div className="pixel-hero-copy"><p>任务日志</p><h1>把问题写下来，直到它变得清楚。</h1><p>这些文章来自真实学习和构建过程。</p></div><aside className="pixel-page-badge" aria-label="文章任务板"><span>LOG</span><strong>{String(articles.length).padStart(2, "0")}</strong><small>篇已记录</small></aside></header><Suspense fallback={<p>正在整理文章...</p>}><FilterableGrid items={articles} type="文章" /></Suspense></main>; }
