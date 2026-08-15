import { projects } from "../../_data/site-data";
import { getPublishedArticles } from "../../../lib/content";

export async function GET(request) {
  const query = new URL(request.url).searchParams.get("q")?.trim().toLowerCase() || "";
  const articles = await getPublishedArticles();
  const items = [
    ...articles.map((article) => ({ type: "文章", title: article.title, description: article.description, tags: article.tags, href: `/articles/${article.slug}` })),
    ...projects.map((project) => ({ type: "项目", title: project.title, description: project.summary, tags: project.tags, href: `/projects/${project.slug}` })),
  ];
  if (!query) return Response.json({ results: items.slice(0, 6) });
  return Response.json({ results: items.filter((item) => [item.title, item.description, ...item.tags].join(" ").toLowerCase().includes(query)).slice(0, 12) });
}
