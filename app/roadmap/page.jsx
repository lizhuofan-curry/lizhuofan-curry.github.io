import Link from "next/link";
import { ArrowUpRight, BookOpenText, Brain, Code, GitBranch, Sparkle } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "学习路线",
  description: "Zhuo 从算法、PyTorch、机器学习到 LLM 与 AI 应用作品集的项目地图。",
  alternates: { canonical: "/roadmap" },
};

const roadmapStages = [
  {
    icon: Code,
    label: "01 / 算法基础",
    title: "C++、数据结构与算法模板",
    body: "先把常见模板、题型和易错点沉淀成可复习的基础仓库。",
    links: [{ href: "https://github.com/lizhuofan-curry/algorithm-templates", text: "algorithm-templates" }],
  },
  {
    icon: Brain,
    label: "02 / 深度学习实验",
    title: "PyTorch、CNN、RNN 与课程复现",
    body: "用课程笔记、Notebook 和实验曲线记录模型结构如何真正运行。",
    links: [
      { href: "https://github.com/lizhuofan-curry/LiuErDaRenPyTorch", text: "LiuErDaRenPyTorch" },
      { href: "https://github.com/lizhuofan-curry/LiHongYiML-2021-2022", text: "LiHongYiML-2021-2022" },
    ],
  },
  {
    icon: BookOpenText,
    label: "03 / AI 应用产品",
    title: "把模型能力放进真实交互流程",
    body: "从商品视觉、AI Study Coach 到问渠陪读室，重点是可运行、可测试和可解释。",
    links: [
      { href: "https://github.com/lizhuofan-curry/smart-image-treasure-hunt", text: "smart-image-treasure-hunt" },
      { href: "https://github.com/lizhuofan-curry/LLM-FullStack-Journey", text: "LLM-FullStack-Journey" },
      { href: "https://github.com/lizhuofan-curry/wenqu", text: "wenqu" },
    ],
  },
  {
    icon: GitBranch,
    label: "04 / 作品集沉淀",
    title: "个人网站、文章和项目沉淀",
    body: "将公开项目、文章和学习路线串起来，让访问者能从一个入口了解做过的事。",
    links: [
      { href: "/projects", text: "项目地图" },
      { href: "/articles", text: "文章日志" },
    ],
  },
];

export default function RoadmapPage() {
  return (
    <main id="main-content" className="roadmap-page page-shell">
      <header className="pixel-page-hero surface-card">
        <div className="pixel-hero-copy">
          <p>学习路线</p>
          <h1>从基础练习到 AI 应用作品集。</h1>
          <p>这里把公开仓库按成长路径重新排列：先打基础，再做实验，最后把能力做成可运行的产品。</p>
        </div>
        <aside className="pixel-page-badge map-badge" aria-label="路线阶段"><span>PATH</span><strong>04</strong><small>个阶段</small></aside>
      </header>

      <section className="roadmap-track" aria-label="Zhuo 的学习路线阶段">
        {roadmapStages.map((stage, index) => {
          const Icon = stage.icon;
          return (
            <article className="roadmap-stage surface-card" key={stage.label}>
              <div className="roadmap-node"><Icon size={24} weight="duotone" /><span>{String(index + 1).padStart(2, "0")}</span></div>
              <div>
                <p className="section-kicker">{stage.label}</p>
                <h2>{stage.title}</h2>
                <p>{stage.body}</p>
                <div className="roadmap-links">
                  {stage.links.map((link) => link.href.startsWith("/") ? (
                    <Link href={link.href} key={link.href}>{link.text} <ArrowUpRight size={15} /></Link>
                  ) : (
                    <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>{link.text} <ArrowUpRight size={15} /></a>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="home-note">
        <Sparkle size={23} />
        <p>路线图只陈述公开仓库可验证的内容；更细的项目说明可以继续进入项目地图查看。</p>
        <Link href="/projects">打开项目地图 <ArrowUpRight size={16} /></Link>
      </section>
    </main>
  );
}
