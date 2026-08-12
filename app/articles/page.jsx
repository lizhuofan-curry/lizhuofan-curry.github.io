import { Suspense } from "react";
import { FilterableGrid } from "../_components/FilterableGrid";
import { articles } from "../_data/articles";

export const metadata = { title: "文章", description: "关于调试、深度学习结构和实验证据的中文短文。", alternates: { canonical: "/articles" } };
export default function ArticlesPage() { return <main id="main-content" className="index-page"><header className="page-hero"><p>FIELD NOTES / 文章索引</p><h1>把问题写下来，<br/>直到它变得清楚。</h1><p>短文章来自真实学习记录。它们不假装覆盖所有知识，只保存一次具体理解可以被复用的部分。</p></header><Suspense fallback={<p>正在整理文章…</p>}><FilterableGrid items={articles} type="文章" /></Suspense></main>; }
