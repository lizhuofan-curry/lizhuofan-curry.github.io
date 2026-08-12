import { notFound } from "next/navigation";
import Link from "next/link";
import { articleModules, articles, getArticle } from "../../_data/articles";

export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }
export const dynamicParams = false;
export async function generateMetadata({ params }) { const { slug } = await params; const article = getArticle(slug); return article ? { title: article.title, description: article.description, alternates: { canonical: `/articles/${slug}` }, openGraph: { type: "article", title: article.title, description: article.description } } : {}; }
export default async function ArticlePage({ params }) { const { slug } = await params; const article = getArticle(slug); const load = articleModules[slug]; if (!article || !load) notFound(); const { default: Content } = await load(); return <main id="main-content" className="article-page"><Link className="back-link" href="/articles">← 返回文章</Link><header><p>{article.category} · {article.readingTime}</p><h1>{article.title}</h1><strong>{article.description}</strong><div className="large-tags">{article.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></header><article className="prose"><Content /></article><footer className="article-end"><p>这篇笔记到这里。理解还会继续连接。</p><Link href="/articles">阅读其他文章 →</Link></footer></main>; }
