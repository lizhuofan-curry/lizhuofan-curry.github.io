import { articles } from "./articles";
import { projects } from "./site-data";

export const searchItems = [
  ...articles.map((article) => ({
    type: "文章",
    title: article.title,
    description: article.description,
    tags: article.tags,
    keywords: article.keywords,
    href: `/articles/${article.slug}`,
  })),
  ...projects.map((project) => ({
    type: "项目",
    title: project.title,
    description: project.summary,
    tags: [project.category, ...project.tags],
    keywords: [project.eyebrow, project.question, project.role],
    href: `/projects/${project.slug}`,
  })),
];
