import { articles, getArticle } from "../app/_data/articles";

export async function getPublishedArticles() {
  return articles.map((article) => ({ ...article, viewCount: 0, likeCount: 0, source: "mdx" }));
}

export async function getPublishedArticle(slug) {
  const article = getArticle(slug);
  return article ? { ...article, viewCount: 0, likeCount: 0, source: "mdx" } : null;
}
