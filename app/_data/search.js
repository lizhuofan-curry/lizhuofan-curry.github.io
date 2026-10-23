import { articles } from "./articles";
import { projects } from "./site-data";

export const searchItems = [
  ...articles.map((article) => ({
    type: "笔记",
    archived: article.archived,
    title: article.title,
    description: article.description,
    tags: article.tags,
    keywords: article.keywords,
    href: `/articles/${article.slug}`,
  })),
  ...projects.map((project) => ({
    type: "作品",
    archived: project.archived,
    title: project.title,
    description: project.summary,
    tags: [project.category, ...project.tags],
    keywords: [project.eyebrow, project.question, project.role].filter(Boolean),
    href: `/projects/${project.slug}`,
  })),
];
