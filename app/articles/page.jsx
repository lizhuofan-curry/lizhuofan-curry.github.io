import Link from "next/link";
import { getPublishedArticles } from "../../lib/content";

export const metadata = { title: "文章", description: "关于调试、深度学习结构和实验的中文短文。", alternates: { canonical: "/articles" } };

export default async function ArticlesPage() {
  const articles = await getPublishedArticles();
  return (
    <main id="main-content" className="blog-page">
      <header className="blog-header">
        <h1>博客</h1>
        <p>把问题写下来，直到它变得清楚。</p>
        <p className="blog-count">共 {articles.length} 篇文章</p>
      </header>
      <div className="article-list">
        {articles.map((article, index) => (
          <Link href={`/articles/${article.slug}`} className="article-item" style={{ "--i": index }} key={article.slug}>
            <h2 className="title">{article.title}</h2>
            <p className="summary">{article.description}</p>
            <div className="details">
              <span className="detail-item">#{article.category}</span>
              <span className="detail-item">{article.readingTime}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
