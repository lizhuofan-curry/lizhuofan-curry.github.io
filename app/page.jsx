import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpenText, Code, GitBranch, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { getPublishedArticles } from "../lib/content";
import { projects } from "./_data/site-data";

export default async function Home() {
  const articles = await getPublishedArticles();
  const icons = [BookOpenText, Sparkle, GitBranch, Code];
  return <main id="main-content" className="home-page page-shell">
    <section className="profile-card entrance-card">
      <Image src="/zhuo-avatar.png" alt="Zhuo 的临时头像" width={112} height={112} priority />
      <div><p className="profile-kicker">ZHUO / 个人博客</p><h1>在代码和问题之间，留下可以回看的路径。</h1><p>我正在学习人工智能、计算机视觉与 LLM 工程。这里保存真实项目、技术文章和仍在推进的理解。</p><div className="profile-actions"><Link className="primary-button" href="/articles">阅读文章 <ArrowUpRight size={18} /></Link><Link className="secondary-button" href="/projects">查看项目</Link></div></div>
      <aside className="current-note"><Sparkle size={22} /><strong>现在关注</strong><p>从能运行的模型继续走向可验证、可维护的软件。</p></aside>
    </section>
    <div className="home-grid">
      <section className="surface-card latest-card"><header className="section-title"><div><h2>最近文章</h2><p>从一个具体问题开始，把理解写清楚。</p></div><Link href="/articles">全部文章</Link></header><div className="article-list">{articles.slice(0, 4).map((article) => <Link href={`/articles/${article.slug}`} key={article.slug}><div><span>{article.category}</span><h3>{article.title}</h3><p>{article.description}</p></div><small>{article.readingTime}</small></Link>)}</div></section>
      <aside className="home-rail"><section className="surface-card focus-card"><Code size={25} /><h2>学习坐标</h2><dl><div><dt>模型</dt><dd>PyTorch、CNN、视觉任务</dd></div><div><dt>产品</dt><dd>React、FastAPI、数据库</dd></div><div><dt>方法</dt><dd>调试、证据、复盘</dd></div></dl></section><section className="surface-card link-card"><BookOpenText size={25} /><h2>为什么写下来</h2><p>文章不是答案陈列，而是一次理解如何形成的记录。</p><Link href="/about">了解 Zhuo</Link></section></aside>
    </div>
    <section className="surface-card selected-projects"><header className="section-title"><div><h2>精选项目</h2><p>代码、产品与证据共同组成项目档案。</p></div><Link href="/projects">项目索引</Link></header><div className="project-mosaic">{projects.slice(0, 3).map((project, index) => { const Icon = icons[index]; return <Link className={`project-tile tile-${index + 1}`} href={`/projects/${project.slug}`} key={project.slug}><div className="project-icon"><Icon size={24} /></div><span>{project.category}</span><h3>{project.title}</h3><p>{project.summary}</p><strong>查看案例 <ArrowUpRight size={17} /></strong></Link>; })}</div></section>
  </main>;
}
