import { Suspense } from "react";
import { FilterableGrid } from "../_components/FilterableGrid";
import { getPublishedArticles } from "../../lib/content";

export const metadata = { title: "文章", description: "关于调试、深度学习结构和实验证据的中文短文。", alternates: { canonical: "/articles" } };
export default async function ArticlesPage() { const articles = await getPublishedArticles(); return <main id="main-content" className="index-page page-shell"><header className="page-hero surface-card"><p>文章索引</p><h1>把问题写下来，直到它变得清楚。</h1><p>这些文章来自真实学习和构建过程，区分观察、证据与结论。</p></header><Suspense fallback={<p>正在整理文章...</p>}><FilterableGrid items={articles} type="文章" /></Suspense></main>; }
