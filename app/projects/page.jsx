import Link from "next/link";
import { SiteFooter, SiteHeader } from "../_components/SiteHeader";
import { projects } from "../_data/site-data";

export const metadata = { title: "项目档案 — Zhuofan Li" };

export default function ProjectsPage() {
  return <main className="knowledge-page"><SiteHeader /><section className="page-hero"><p className="label">01 / PROJECT ARCHIVE</p><h1>每个作品，<br /><em>都有一个问题。</em></h1><p>这里不是项目截图墙，而是从问题、方法到证据边界的工作档案。</p></section><section className="archive-grid" aria-label="项目档案">{projects.map((project) => <article className={`archive-card ${project.accent}`} key={project.slug}><div><span>{project.number}</span><span>{project.category}</span></div><p>{project.eyebrow}</p><h2>{project.title}</h2><p className="archive-summary">{project.summary}</p><div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><Link className="card-link" href={`/projects/${project.slug}`}>打开档案 <span>→</span></Link></article>)}</section><SiteFooter /></main>;
}
