import Link from "next/link";
import { notFound } from "next/navigation";
import { articleModules } from "../../_data/articles";
import { getPublishedArticle } from "../../../lib/content";
import { getPublicComments } from "../../../lib/comments";
import { ArticleEngagement } from "../../_components/ArticleEngagement";
import { ArticleComments } from "../../_components/ArticleComments";
import { MarkdownArticle } from "../../_components/MarkdownArticle";
import { isAuthConfigured } from "../../../lib/auth";
import { isDatabaseConfigured } from "../../../lib/db";
import { headingId } from "../../../lib/headings";
import { getCurrentViewer } from "../../../lib/session";

function headings(markdown = "") {
  return markdown.split("\n").filter((line) => /^##\s+/.test(line)).map((line) => { const text = line.replace(/^##\s+/, ""); return { id: headingId(text), text }; });
}

export async function generateMetadata({ params }) { const { slug } = await params; const article = await getPublishedArticle(slug); return article ? { title: article.title, description: article.description, alternates: { canonical: `/articles/${slug}` }, openGraph: { type: "article", title: article.title, description: article.description } } : {}; }

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) notFound();
  const toc = article.toc || headings(article.body);
  const [comments, viewer] = await Promise.all([getPublicComments(slug), getCurrentViewer()]);
  let LocalContent = null;
  if (article.source === "mdx" && articleModules[slug]) LocalContent = (await articleModules[slug]()).default;
  return <main id="main-content" className="article-page page-shell"><Link className="back-link" href="/articles">← 返回文章</Link><div className="article-layout"><article className="reading-card"><header className="article-header"><p>{article.category} / {article.readingTime}</p><h1>{article.title}</h1><strong>{article.description}</strong><div className="large-tags">{article.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><ArticleEngagement configured={isDatabaseConfigured() && isAuthConfigured()} slug={slug} initialViews={article.viewCount} initialLikes={article.likeCount} /></header><div className="prose">{LocalContent ? <LocalContent /> : <MarkdownArticle>{article.body}</MarkdownArticle>}</div><ArticleComments slug={slug} initialComments={comments} signedIn={Boolean(viewer.session)} /><footer className="article-end"><p>理解还会继续更新。</p><Link href="/articles">阅读其他文章</Link></footer></article><aside className="toc-card"><strong>文章目录</strong>{toc.length ? <nav>{toc.map((item) => <a href={`#${item.id}`} key={item.id}>{item.text}</a>)}</nav> : <p>这篇文章较短，可以直接阅读。</p>}<Link href="/articles">返回文章索引</Link></aside></div></main>;
}
