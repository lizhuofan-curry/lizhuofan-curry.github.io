import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject, projects } from "../../_data/site-data";
import { RelatedLinks } from "../../_components/RelatedLinks";
import { SaveButton } from "../../_components/SaveButton";

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export const dynamicParams = false;
export async function generateMetadata({ params }) { const { slug } = await params; const project = getProject(slug); return project ? { title: project.title, description: project.summary, alternates: { canonical: `/projects/${slug}` } } : {}; }

export default async function ProjectPage({ params }) { const { slug } = await params; const project = getProject(slug); if (!project) notFound(); return <main id="main-content" className="detail-page"><Link className="back-link" href="/projects">← 返回项目</Link><header className="detail-hero"><p>{project.eyebrow}</p><h1>{project.title}</h1><strong>{project.question}</strong><div className="detail-meta"><span>{project.category}</span><span>{project.role}</span><span>{project.signal}</span></div><SaveButton kind="project" slug={slug} title={project.title} /></header><div className="case-layout"><article><section><p className="section-label">01 / 项目简介</p><h2>{project.summary}</h2><p>{project.copy}</p></section><section><p className="section-label">02 / 实现亮点</p><ol className="highlight-list">{project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ol></section><section><p className="section-label">03 / 技术栈</p><div className="large-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></section></article><aside className="evidence-card"><p>EVIDENCE / 外部证据</p><h2>继续查看真实项目</h2><p>以下链接指向公开仓库或正在运行的演示，不在本站复制不可验证的成果。</p><a href={project.href} target="_blank" rel="noreferrer">打开 GitHub 仓库 ↗</a>{project.demo && <a href={project.demo} target="_blank" rel="noreferrer">访问在线演示 ↗</a>}</aside></div><RelatedLinks current={project} kind="project" /></main>; }
