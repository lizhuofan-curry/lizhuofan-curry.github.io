import Link from "next/link";
import { ArrowUpRight, BookOpenText, Code, GitBranch, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { getPublishedArticles } from "../lib/content";
import { projects } from "./_data/site-data";
import { PixelCourt } from "./_components/PixelCourt";
import { PersonalPath } from "./_components/PersonalPath";

export default async function Home() {
  const articles = await getPublishedArticles();
  const icons = [BookOpenText, Sparkle, GitBranch, Code];
  return <main id="main-content" className="home-page page-shell">
    <section className="pixel-hero entrance-card">
      <header className="pixel-window-bar"><span>ZHUO.EXE</span><span>个人学习档案</span><i aria-hidden="true" /></header>
      <div className="pixel-hero-main">
        <PixelCourt />
        <div className="pixel-hero-copy">
          <p className="profile-kicker">当前存档：学习、构建与复盘</p>
          <h1>Zhuo 的<br />学习冒险</h1>
          <p>在人工智能、计算机视觉和软件工程之间，把每次调试、项目与理解认真存档。</p>
          <div className="profile-actions"><Link className="primary-button" href="/articles">打开文章日志 <ArrowUpRight size={18} /></Link><Link className="secondary-button" href="/projects">浏览项目地图</Link></div>
          <dl className="pixel-stats"><div><dt>正在练习</dt><dd>AI · CV · LLM</dd></div><div><dt>记录方式</dt><dd>代码 · 文章 · 证据</dd></div></dl>
        </div>
      </div>
    </section>
    <section className="home-writing">
      <header className="section-title"><div><p className="section-kicker">任务日志</p><h2>最近文章</h2><p>从一个具体问题出发，把过程和依据写清楚。</p></div><Link href="/articles">打开完整日志 <ArrowUpRight size={16} /></Link></header>
      <div className="article-list">{articles.slice(0, 4).map((article) => <Link href={`/articles/${article.slug}`} key={article.slug}><span className="article-list-marker" /><div><span>{article.category}</span><h3>{article.title}</h3><p>{article.description}</p></div><small>{article.readingTime}</small></Link>)}</div>
    </section>
    <PersonalPath articles={articles} />
    <section className="home-signal-grid">
      <aside className="focus-card"><Code size={25} /><p className="section-kicker">本周练习</p><h2>继续把模型做成能解释、能维护的软件。</h2><dl><div><dt>模型</dt><dd>PyTorch、CNN、视觉任务</dd></div><div><dt>产品</dt><dd>React、FastAPI、数据库</dd></div><div><dt>方法</dt><dd>调试、证据、复盘</dd></div></dl></aside>
      <section className="selected-projects"><header className="section-title"><div><p className="section-kicker">已解锁项目</p><h2>项目地图</h2></div><Link href="/projects">查看全部 <ArrowUpRight size={16} /></Link></header><div className="project-mosaic">{projects.slice(0, 3).map((project, index) => { const Icon = icons[index]; return <Link className={`project-tile tile-${index + 1}`} href={`/projects/${project.slug}`} key={project.slug}><div className="project-icon"><Icon size={24} /></div><span>{project.category}</span><h3>{project.title}</h3><p>{project.summary}</p><strong>进入项目 <ArrowUpRight size={17} /></strong></Link>; })}</div></section>
    </section>
    <section className="home-note"><Sparkle size={23} /><p>这里不是答案陈列，而是一次理解如何形成的存档。</p><Link href="/about">查看人物设定 <ArrowUpRight size={16} /></Link></section>
  </main>;
}
