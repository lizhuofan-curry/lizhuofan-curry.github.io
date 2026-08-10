import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    number: "01",
    eyebrow: "AI READING PRODUCT",
    title: "问渠 Wenqu",
    copy: "不是另一个 PDF 聊天框，而是一间强调原文证据的 AI 陪读阅读室：材料地图、双轨跟读、主动回忆、错因诊断与阅读档案，组成完整学习闭环。",
    tags: ["React 19", "FastAPI", "DeepSeek", "Supabase"],
    href: "https://github.com/lizhuofan-curry/wenqu",
    demo: "https://wenqu-reading-room.vercel.app/",
    accent: "lime",
    signal: "LIVE / v.4",
    slug: "wenqu",
  },
  {
    number: "02",
    eyebrow: "COMPUTER VISION SYSTEM",
    title: "智图寻宝 · Shop Vision",
    copy: "一次上传串起商品分类、图像去噪、同类检索与 AI 文案。它不止训练模型，也把数据、权重、特征库、Web 推理和结果解释接成闭环。",
    tags: ["PyTorch", "Flask", "U-Net", "KNN"],
    href: "https://github.com/lizhuofan-curry/smart-image-treasure-hunt",
    accent: "orange",
    signal: "VAL ACC / 99.32%",
    slug: "shop-vision",
  },
  {
    number: "03",
    eyebrow: "MODEL STUDY",
    title: "CNN × Inception × ResNet",
    copy: "在 CIFAR-10 上用同一训练流程比较三种架构。分支通过 torch.cat 汇合，残差通过 F(x)+x 保留信息；代码、曲线与结论各自保留清晰证据边界。",
    tags: ["CIFAR-10", "torch.cat", "Residual", "20 epochs"],
    href: "https://github.com/lizhuofan-curry/LiuErDaRenPyTorch/tree/main/Chapter11_AdvancedCNN/CIFAR10_Three_CNN_Architectures",
    accent: "blue",
    signal: "3 ARCHITECTURES",
    slug: "cnn-architectures",
  },
  {
    number: "04",
    eyebrow: "LLM ENGINEERING LOG",
    title: "LLM FullStack Journey",
    copy: "从可运行的 AI Study Coach 出发，持续扩展 Provider、测试、CI、RAG 与 Agent 工作流。这里记录的不只是功能，也是把想法变成可靠软件的过程。",
    tags: ["Python", "FastAPI", "LLM", "LangGraph"],
    href: "https://github.com/lizhuofan-curry/LLM-FullStack-Journey",
    accent: "violet",
    signal: "BUILD → TEST → LEARN",
    slug: "llm-fullstack",
  },
];

const principles = [
  ["01", "TRACEBACK FIRST", "先找到真正失败的那一行，再谈修复。"],
  ["02", "SHAPE AWARE", "让每一层的通道与空间尺寸都有据可查。"],
  ["03", "EVIDENCE > CLAIMS", "验证集就是验证集，不把曲线包装成测试结论。"],
  ["04", "BUILD TO LEARN", "把概念做成能运行、能检查、能展示的作品。"],
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.7-1.3-2.3-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.8 1a9.4 9.4 0 0 1 5 0c2-1.3 2.8-1 2.8-1a3.6 3.6 0 0 1 .1 2.7 3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.8v2.9c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.5Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <main>
      <header className="nav-wrap">
        <nav className="nav" aria-label="主导航">
          <a className="brand" href="#top">
            <i />
            ZF / FIELD NOTES
          </a>
          <div className="nav-links">
            <Link href="/projects">项目</Link>
            <Link href="/notes">笔记</Link>
            <Link href="/lab">实验台</Link>
            <Link href="/now">Now</Link>
          </div>
          <a className="github-link" href="https://github.com/lizhuofan-curry" target="_blank" rel="noreferrer" aria-label="访问 Zhuofan Li 的 GitHub 主页">
            <GitHubMark />
            <span>GitHub</span>
          </a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="noise" />
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="kicker"><span>●</span> EXPLORING AI, ONE TRACE AT A TIME</p>
            <h1>
              把好奇心
              <br />
              <em>编译成作品。</em>
            </h1>
            <p className="lead">
              你好，我是李卓凡。<br />
              我在机器学习、深度学习与 AI 产品之间往返，
              用真实输出理解原理，用可运行系统记录成长。
            </p>
            <div className="hero-actions">
              <a className="button button-solid" href="#work">进入实验现场 <Arrow /></a>
              <Link className="text-link" href="/projects">打开项目档案 <Arrow /></Link>
            </div>
          </div>

          <div className="hero-console" role="img" aria-label="从问题、代码、运行到证据的个人学习方法动态图示">
            <div className="console-top"><span><i /> LEARNING_LOOP.py</span><span>RUNNING</span></div>
            <div className="code-lines" aria-hidden="true">
              <p><b>01</b><span className="pink">def</span> <span className="blue">learn</span>(question):</p>
              <p><b>02</b>&nbsp;&nbsp;evidence = <span className="blue">inspect</span>(traceback)</p>
              <p><b>03</b>&nbsp;&nbsp;model = <span className="blue">build</span>(idea)</p>
              <p><b>04</b>&nbsp;&nbsp;result = model.<span className="blue">run</span>()</p>
              <p><b>05</b>&nbsp;&nbsp;<span className="pink">return</span> <span className="lime">document</span>(result)</p>
            </div>
            <div className="network" aria-hidden="true">
              <span className="node n1">?</span><span className="node n2">CODE</span>
              <span className="node n3">RUN</span><span className="node n4">EVIDENCE</span>
              <span className="node n5">NEXT</span>
              <i className="beam b1" /><i className="beam b2" /><i className="beam b3" /><i className="beam b4" />
            </div>
            <div className="console-foot"><span>STATUS <strong>CURIOUS</strong></span><span>r = a(1 − sinθ)</span></div>
          </div>
        </div>
        <div className="hero-marquee" aria-hidden="true">
          <span>PYTORCH</span><i>✦</i><span>COMPUTER VISION</span><i>✦</i><span>LLM SYSTEMS</span><i>✦</i><span>EVIDENCE-DRIVEN</span><i>✦</i>
        </div>
      </section>

      <section className="work section" id="work">
        <div className="section-head">
          <div><p className="label">01 / SELECTED BUILDS</p><h2>不是陈列柜，<br />是正在生长的实验场。</h2></div>
          <p>每个项目都回答一个具体问题：如何读懂材料、如何让视觉模型形成产品闭环、如何比较网络结构，以及如何把 LLM 想法做成工程。</p>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className={`project-card ${project.accent}`} key={project.title}>
              <div className="project-top"><span>{project.number}</span><span className="signal"><i />{project.signal}</span></div>
              <p className="project-eyebrow">{project.eyebrow}</p>
              <h3>{project.title}</h3>
              <p className="project-copy">{project.copy}</p>
              <div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <div className="project-links">
                <Link href={`/projects/${project.slug}`}>CASE STUDY <Arrow /></Link>
                <a href={project.href} target="_blank" rel="noreferrer">SOURCE <Arrow /></a>
                {project.demo && <a href={project.demo} target="_blank" rel="noreferrer">LIVE DEMO <Arrow /></a>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="method" id="method">
        <div className="method-inner">
          <div className="method-title">
            <p className="label">02 / HOW I WORK</p>
            <h2>先看证据，<br /><span>再写答案。</span></h2>
            <p>调试不是不断试错，而是让每一步都缩小未知范围。</p>
          </div>
          <div className="principles">
            {principles.map(([number, title, copy]) => (
              <div className="principle" key={title}><span>{number}</span><strong>{title}</strong><p>{copy}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="about section" id="about">
        <div className="portrait-wrap">
          <div className="portrait-ring" />
          <Image
            src="/profile-avatar.jpg"
            alt="Zhuofan Li 的 GitHub 头像"
            width={176}
            height={176}
            sizes="(max-width: 640px) 112px, 156px"
            loading="eager"
          />
          <span>HENU · SOFTWARE</span>
        </div>
        <div className="about-copy">
          <p className="label">03 / ABOUT THE BUILDER</p>
          <h2>有目标的人才会迷路，<br />我只是来地球散步的。</h2>
          <p>“散步”不是没有方向，而是允许自己靠近问题、观察细节，再走出一条属于自己的路线。现在的路线从 Python 与 PyTorch 出发，经过计算机视觉，正走向可用、可信的 LLM 应用。</p>
          <div className="stack-row"><span>PYTHON</span><span>PYTORCH</span><span>REACT</span><span>FASTAPI</span><span>GIT</span></div>
          <a className="button button-outline" href="mailto:Lizhuofan@henu.edu.cn">和我聊聊 <Arrow /></a>
        </div>
      </section>

      <section className="closing">
        <p className="label">NEXT EXPERIMENT</p>
        <h2>What should we<br /><em>build next?</em></h2>
        <a className="button button-solid" href="https://github.com/lizhuofan-curry" target="_blank" rel="noreferrer">继续在 GitHub 散步 <Arrow /></a>
        <div className="orbit" aria-hidden="true"><i /><i /><i /></div>
      </section>

      <footer><span>© {new Date().getFullYear()} ZHUOFAN LI</span><span>DESIGNED AROUND CURIOSITY + EVIDENCE</span><a href="#top">BACK TO TOP ↑</a></footer>
    </main>
  );
}
