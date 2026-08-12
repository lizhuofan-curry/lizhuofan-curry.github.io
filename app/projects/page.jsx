import { Suspense } from "react";
import { FilterableGrid } from "../_components/FilterableGrid";
import { projects } from "../_data/site-data";

export const metadata = { title: "项目", description: "李卓凡的人工智能、计算机视觉和 LLM 工程项目。", alternates: { canonical: "/projects" } };

export default function ProjectsPage() { return <main id="main-content" className="index-page"><header className="page-hero"><p>PROJECT ARCHIVE / 项目档案</p><h1>做出来，<br/>再把证据留下。</h1><p>从模型结构实验到可运行的 AI 产品。每个项目只陈述能够由代码、页面或仓库验证的内容。</p></header><Suspense fallback={<p>正在整理项目…</p>}><FilterableGrid items={projects.map((project) => ({...project, description: project.summary}))} type="项目" /></Suspense></main>; }
