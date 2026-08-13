import { getPublishedArticles } from "../lib/content";
import { siteConfig } from "./_data/site";
import { projects } from "./_data/site-data";
export default async function sitemap() { const articles = await getPublishedArticles(); const paths = ["", "/articles", "/projects", "/about", "/privacy", ...articles.map(({slug}) => `/articles/${slug}`), ...projects.map(({slug}) => `/projects/${slug}`)]; return paths.map((path) => ({ url: `${siteConfig.siteUrl}${path}`, changeFrequency: path === "" ? "weekly" : "monthly", priority: path === "" ? 1 : .7 })); }
