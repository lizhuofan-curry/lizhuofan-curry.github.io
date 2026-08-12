import { articles } from "./_data/articles";
import { siteConfig } from "./_data/site";
import { projects } from "./_data/site-data";
export const dynamic = "force-static";
export default function sitemap() { const paths = ["", "/articles", "/projects", "/about", ...articles.map(({slug}) => `/articles/${slug}`), ...projects.map(({slug}) => `/projects/${slug}`)]; return paths.map((path) => ({ url: `${siteConfig.siteUrl}${path}`, changeFrequency: path === "" ? "weekly" : "monthly", priority: path === "" ? 1 : .7 })); }
