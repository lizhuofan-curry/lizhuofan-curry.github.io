import Image from "next/image";
import Link from "next/link";

const projects = [
  { id: "01", title: "问渠 Wenqu", type: "AI READING PRODUCT", copy: "一间强调原文证据、双轨跟读与阅读档案的 AI 陪读阅读室。", href: "/projects/wenqu", signal: "LIVE / v.4" },
  { id: "02", title: "智图寻宝", type: "COMPUTER VISION", copy: "把商品分类、去噪、同类检索和 AI 文案接进一条可运行的视觉路径。", href: "/projects/shop-vision", signal: "VAL / 99.32%" },
  { id: "03", title: "CNN × Inception × ResNet", type: "MODEL STUDY", copy: "用同一训练流程阅读三种网络结构，也为曲线与结论留下边界。", href: "/projects/cnn-architectures", signal: "3 ARCHITECTURES" },
  { id: "04", title: "LLM FullStack Journey", type: "ENGINEERING LOG", copy: "把 Provider、测试、CI、RAG 与 Agent 工作流慢慢连接成可靠的软件。", href: "/projects/llm-fullstack", signal: "BUILD → TEST → LEARN" },
];

const paths = [
  { index: "A", label: "PERSONAL GARDEN", title: "收集正在发生的事", copy: "照片、书页、城市、音乐、灵感和仍在生长的念头。", href: "/garden", tone: "garden" },
  { index: "B", label: "FIELD NOTES", title: "把问题写成路标", copy: "从形状、训练循环到证据边界，留下真正可复用的学习笔记。", href: "/notes", tone: "notes" },
  { index: "C", label: "TRACEBACK MUSEUM", title: "把失败保留下来", copy: "真实报错、排查过程，以及它们后来教会我的判断方式。", href: "/museum", tone: "museum" },
  { index: "D", label: "LEARNING MAP", title: "看见走过的路线", copy: "从 Python、模型实验到产品和 LLM 工程，一条持续更新的成长地图。", href: "/map", tone: "map" },
];

function Arrow() { return <span aria-hidden="true">↗</span>; }

function GitHubMark() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.7-1.3-2.3-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.8 1a9.4 9.4 0 0 1 5 0c2-1.3 2.8-1 2.8-1a3.6 3.6 0 0 1 .1 2.7 3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.8v2.9c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.5Z" /></svg>; }

export default function Home() {
  return <main className="home-index">
    <header className="index-nav-wrap">
      <nav className="index-nav" aria-label="主导航">
        <Link className="index-brand" href="/"><i /> ZHUOFAN LI</Link>
        <div><Link href="#work">作品</Link><Link href="#paths">花园</Link><Link href="/now">Now</Link></div>
        <a className="index-github" href="https://github.com/lizhuofan-curry" target="_blank" rel="noreferrer"><GitHubMark /><span>GitHub</span></a>
      </nav>
    </header>

    <section className="index-hero" id="top">
      <div className="index-hero-main"><p className="index-kicker">PERSONAL FIELD NOTES / 2026</p><h1>r = a(1 − sinθ)</h1><p className="index-intro">从代码、书页、城市和未完成的想法里，<br />收集我正在成为谁的证据。</p><div className="index-actions"><a href="#work">看精选作品 <Arrow /></a><Link href="/garden">走进个人花园 <Arrow /></Link></div></div>
      <aside className="index-card"><span className="index-card-pin" /><p>OPEN INDEX</p><dl><div><dt>WHO</dt><dd>李卓凡 / Zhuofan Li</dd></div><div><dt>MAKING</dt><dd>AI systems, learning notes &amp; small observations</dd></div><div><dt>GUIDED BY</dt><dd>Curiosity, evidence and a willingness to wander</dd></div></dl><Link href="/now">查看此刻在做什么 →</Link></aside>
      <div className="index-hero-foot"><span>SCROLL TO EXPLORE</span><span>↓</span><span>HENU · SOFTWARE</span></div>
    </section>

    <section className="index-statement"><p>这不是一份履历，也不只是技术作品集。它是一张持续展开的个人索引：记录我解决过的问题、喜欢过的东西，以及仍在路上的方向。</p></section>

    <section className="index-work" id="work"><div className="index-section-head"><p>01 / SELECTED WORK</p><h2>做过的事，<br /><em>正在继续生长。</em></h2><Link href="/projects">查看全部项目 →</Link></div><div className="index-project-list">{projects.map((project) => <Link href={project.href} className="index-project" key={project.id}><span className="project-number">{project.id}</span><div><p>{project.type}</p><h3>{project.title}</h3><span>{project.copy}</span></div><strong>{project.signal}</strong><i>↗</i></Link>)}</div></section>

    <section className="index-paths" id="paths"><div className="index-section-head"><p>02 / WAYS IN</p><h2>不止项目，<br /><em>还有生活。</em></h2><p className="path-intro">选择一条入口，进入正在收集的东西。</p></div><div className="path-grid">{paths.map((path) => <Link href={path.href} className={`path-card ${path.tone}`} key={path.index}><span>{path.index} / {path.label}</span><h3>{path.title}</h3><p>{path.copy}</p><i>↗</i></Link>)}</div></section>

    <section className="index-about"><div className="index-portrait"><Image src="/profile-avatar.jpg" alt="Zhuofan Li 的头像" width={112} height={112} sizes="112px" /><span>HELLO / 你好</span></div><div><p className="index-kicker">03 / A SMALL INTRODUCTION</p><h2>有目标的人才会迷路，<br />我只是来地球散步的。</h2><p>“散步”不是没有方向，而是允许自己靠近问题、观察细节，再走出一条属于自己的路线。现在，我把学习、构建和生活里的碎片都留在这里。</p><div className="index-tags"><span>PYTHON</span><span>PYTORCH</span><span>REACT</span><span>FASTAPI</span><span>CURIOUS</span></div></div><a className="index-contact" href="mailto:Lizhuofan@henu.edu.cn">写封信给我 <Arrow /></a></section>

    <footer className="index-footer"><span>© {new Date().getFullYear()} ZHUOFAN LI</span><span>MADE AS A LIVING INDEX</span><a href="#top">BACK TO TOP ↑</a></footer>
  </main>;
}
