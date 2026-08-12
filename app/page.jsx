import Image from "next/image";
import Link from "next/link";
import { SignalField } from "./_components/SignalField";
import { articles } from "./_data/articles";
import { projects } from "./_data/site-data";

export default function Home() {
  return <main id="main-content">
    <section className="home-hero">
      <div className="hero-copy"><p className="eyebrow"><span>●</span> ZHUOFAN'S LIVING INDEX</p><h1>让好奇心<br/><em>形成连接。</em></h1><p className="hero-lead">我是李卓凡。这里记录我如何学习人工智能、构建真实项目，并把每次理解留下来。</p><div className="hero-actions"><Link className="primary-action" href="/projects">看我做过的项目 <span>↗</span></Link><Link className="text-action" href="/articles">读最近的文章 →</Link></div><dl className="hero-facts"><div><dt>正在关注</dt><dd>AI · CV · LLM 工程</dd></div><div><dt>记录方式</dt><dd>代码、文章与证据</dd></div></dl></div>
      <SignalField />
    </section>

    <section className="manifesto"><p>我把个人网站当成一张持续更新的坐标图：项目标记做过的事，文章保存理解的过程，未解决的问题指向下一段路径。</p><span>↓ 往下看，最近连接了什么</span></section>

    <section className="home-section projects-preview"><header className="section-heading"><p>SELECTED PROJECTS / 精选项目</p><h2>从模型实验，<br/>走向可运行的产品。</h2><Link href="/projects">浏览全部项目 →</Link></header><div className="project-rows">{projects.slice(0,3).map((project) => <Link href={`/projects/${project.slug}`} key={project.slug}><span>{project.number}</span><div><p>{project.category}</p><h3>{project.title}</h3><small>{project.summary}</small></div><strong>{project.signal}</strong><i>↗</i></Link>)}</div></section>

    <section className="home-section notes-preview"><header className="section-heading"><p>FIELD NOTES / 最近文章</p><h2>把刚刚弄懂的事，<br/>写成下一次的路标。</h2><Link href="/articles">进入文章索引 →</Link></header><div className="article-strip">{articles.slice(0,3).map((article, index) => <Link href={`/articles/${article.slug}`} key={article.slug}><span>0{index + 1}</span><p>{article.category} · {article.readingTime}</p><h3>{article.title}</h3><small>{article.description}</small><b>阅读全文 →</b></Link>)}</div></section>

    <section className="home-about"><div className="avatar-frame"><Image src="/profile-avatar.jpg" alt="李卓凡的头像" width={320} height={320} priority/><span>HELLO / 你好</span></div><div><p className="eyebrow">ABOUT THE MAKER</p><h2>有目标的人才会迷路，<br/>我只是来地球散步的。</h2><p>“散步”不是没有方向，而是允许自己靠近问题、观察细节，再走出一条属于自己的路线。我正在把深度学习、计算机视觉和 LLM 工程里的学习过程，整理成可运行、可复盘的作品。</p><Link className="primary-action" href="/about">再多认识我一点 <span>↗</span></Link></div></section>
  </main>;
}
