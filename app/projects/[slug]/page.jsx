import { notFound } from "next/navigation";
import { getProject, projects } from "../../_data/site-data";
import { ProjectVisual } from "../../_components/ProjectVisual";
import { CaseStudy } from "../../_components/CaseStudy";
import { caseStudies } from "../../_data/case-studies";
import { Icon } from "../../_components/Icon";
export function generateStaticParams() { return projects.map(({slug})=>({slug})); }
export const dynamicParams = false;
export async function generateMetadata({params}) { const {slug}=await params; const p=getProject(slug); return p?{title:p.title,description:p.summary,alternates:{canonical:`/projects/${slug}`}}:{}; }
export default async function ProjectPage({params}) {
  const {slug}=await params; const p=getProject(slug); if(!p)notFound();
  return <main id="main-content" className="page-shell detail-page"><a className="back-link" href="/projects">← 回到作品</a><header className="detail-hero"><span className="project-category">{p.category}{p.archived?" · 项目归档":""}</span><h1>{p.title}</h1><p>{p.summary}</p><div className="detail-actions"><a href={p.href} className="button primary" target="_blank" rel="noreferrer"><Icon name="github"/>查看源码</a>{p.demo&&<a href={p.demo} className="button secondary" target="_blank" rel="noreferrer">打开项目 <Icon name="diagonal" size={18}/></a>}</div></header><ProjectVisual project={p} detail/>
  <div className="case-layout"><article>{caseStudies[slug] ? <CaseStudy slug={slug}/> : <><section><h2>从什么问题开始？</h2><p>{p.question}</p><p>{p.copy}</p></section><section><h2>它能做些什么</h2><ul className="feature-list">{p.highlights.map(text=><li key={text}><Icon name="check" size={19}/><span>{text}</span></li>)}</ul></section><section><h2>继续探索</h2><p>{p.boundary||"具体功能、运行方式与后续计划，以项目仓库中的最新说明为准。"}</p><a className="text-link" href={p.href} target="_blank" rel="noreferrer">阅读项目 README <Icon name="diagonal" size={17}/></a></section></>}</article><aside className="project-facts"><h3>关于这个项目</h3><p className="small-label">使用的技术</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div><p className="small-label">项目类型</p><p>{p.category}</p><p className="small-label">资料来源</p><a href={p.href} target="_blank" rel="noreferrer">公开 GitHub 仓库 <Icon name="diagonal" size={15}/></a>{p.image&&<p className="image-note">图片来自仓库的界面展示，可能与当前在线版本不同。</p>}</aside></div><a className="more-work" href="/projects">再看看其他作品 <Icon name="arrow"/></a></main>;
}
