import { SavedItems } from "../_components/SavedItems";
import { projects } from "../_data/site-data";
import { getPublishedArticles } from "../../lib/content";

export const metadata = {
  title: "我的收藏",
  description: "保存在当前浏览器中的 Zhuo 文章与项目收藏。",
  alternates: { canonical: "/saved" },
  robots: { index: false, follow: false },
};

export default async function SavedPage() {
  const articles = await getPublishedArticles();
  const catalog = [
    ...articles.map((article) => ({ kind: "article", slug: article.slug, title: article.title, description: article.description, href: `/articles/${article.slug}` })),
    ...projects.map((project) => ({ kind: "project", slug: project.slug, title: project.title, description: project.summary, href: `/projects/${project.slug}` })),
  ];
  return <main id="main-content" className="saved-page index-page page-shell"><header className="pixel-page-hero surface-card"><div className="pixel-hero-copy"><p>本机收藏</p><h1>把想继续看的内容放在一起。</h1><p>收藏只保存在当前浏览器，不会上传到服务器，也不会自动同步到其他设备。</p></div><aside className="pixel-page-badge saved-page-badge" aria-label="本机收藏夹"><span>SAVE</span><strong>本机</strong><small>浏览器收藏</small></aside></header><SavedItems catalog={catalog} /></main>;
}
