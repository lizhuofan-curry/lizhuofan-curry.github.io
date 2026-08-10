import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "../../_components/SiteHeader";
import { getProject, projects } from "../../_data/site-data";

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }) { const { slug } = await params; const project = getProject(slug); return { title: project ? `${project.title} — Zhuofan Li` : "项目未找到" }; }

export default async function ProjectCasePage({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <main className="knowledge-page"><SiteHeader /><article className="case-study"><Link className="back-link" href="/projects">← 返回项目档案</Link><p className="label">{project.number} / {project.eyebrow}</p><h1>{project.title}</h1><p className="case-intro">{project.summary}</p><div className="case-meta"><div><span>STARTING QUESTION</span><p>{project.question}</p></div><div><span>ROLE / FOCUS</span><p>{project.role}</p></div></div><section className="case-section"><p className="label">WHAT I BUILT</p><h2>从概念到<br /><em>可运行的路径。</em></h2><ul>{project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></section><section className="case-evidence"><p className="label">EVIDENCE BOUNDARY</p><p>{project.slug === "cnn-architectures" ? "这个档案说明结构和已记录的训练设置；它不把验证曲线当成独立测试结果。" : "这里记录已实现的能力和设计取舍；未提供的数据不被包装成性能结论。"}</p></section><div className="case-actions"><a className="button button-solid" href={project.href} target="_blank" rel="noreferrer">查看源代码 <span>↗</span></a>{project.demo && <a className="button button-outline" href={project.demo} target="_blank" rel="noreferrer">访问在线版本 <span>↗</span></a>}</div></article><SiteFooter /></main>;
}
