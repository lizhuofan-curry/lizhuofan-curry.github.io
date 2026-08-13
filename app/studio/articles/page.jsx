import Link from "next/link";
import { getStudioArticles } from "../../../lib/content";

export default async function StudioArticlesPage() { const articles = await getStudioArticles(); return <main id="main-content" className="studio-page"><header className="studio-header"><div><p>内容</p><h1>文章</h1></div><Link className="primary-button" href="/studio/articles/new">新建文章</Link></header><div className="studio-list">{articles.map((article) => <Link href={`/studio/articles/${article.id}`} key={article.id}><div><strong>{article.title}</strong><span>/{article.slug}</span></div><small>{article.status === "published" ? "已发布" : "草稿"}</small></Link>)}{!articles.length && <div className="empty-state"><strong>还没有数据库文章</strong><p>新文章将先保存为草稿，不会立即公开。</p></div>}</div></main>; }
