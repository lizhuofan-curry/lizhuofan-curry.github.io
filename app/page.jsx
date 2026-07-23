import HeroCurve from "./HeroCurve";

const projects = [
  {
    index: "01",
    title: "LLM FullStack Journey",
    description:
      "可运行的 LLM 全栈学习仓库：从 FastAPI AI Study Coach 出发，逐步探索模型 Provider、测试与 CI，并持续扩展 RAG、LangGraph 与微调实践。",
    tags: ["Python", "FastAPI", "LLM", "LangGraph"],
    href: "https://github.com/lizhuofan-curry/LLM-FullStack-Journey",
  },
  {
    index: "02",
    title: "LiHongYiML 2021—2022",
    description:
      "李宏毅机器学习课程的讲义、作业与学习资料。沿着课程脉络整理机器学习知识，在练习中理解模型与方法。",
    tags: ["Jupyter", "Machine Learning", "Coursework"],
    href: "https://github.com/lizhuofan-curry/LiHongYiML-2021-2022",
  },
  {
    index: "03",
    title: "LiuErDaRen PyTorch",
    description:
      "刘二大人 PyTorch 教程的学习笔记、代码与实验。从基础张量与训练流程出发，逐步走进深度学习模型。",
    tags: ["PyTorch", "Deep Learning", "Experiments"],
    href: "https://github.com/lizhuofan-curry/LiuErDaRenPyTorch",
  },
];

const skills = [
  { name: "Python", level: "持续使用", group: "语言" },
  { name: "PyTorch", level: "实验与实践", group: "深度学习" },
  { name: "Machine Learning", level: "系统学习", group: "AI" },
  { name: "Deep Learning", level: "持续进阶", group: "AI" },
  { name: "FastAPI", level: "项目实践", group: "后端" },
  { name: "LangChain · LangGraph", level: "正在探索", group: "LLM" },
  { name: "C++", level: "算法练习", group: "语言" },
  { name: "Git · Linux", level: "工程基础", group: "工具" },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.7a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.7-1.3-2.3-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.8 1a9.4 9.4 0 0 1 5 0c2-1.3 2.8-1 2.8-1a3.6 3.6 0 0 1 .1 2.7 3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.8v2.9c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.7Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <main>
      <header className="nav-shell">
        <nav className="nav" aria-label="主导航">
          <a className="logo" href="#top" aria-label="返回首页">
            <span>r</span>=a(1−sinθ)
          </a>
          <div className="nav-links">
            <a href="#about">关于</a>
            <a href="#projects">项目</a>
            <a href="#skills">技能</a>
          </div>
          <a
            className="nav-github"
            href="https://github.com/lizhuofan-curry"
            target="_blank"
            rel="noreferrer"
          >
            <GitHubIcon />
            <span>GitHub</span>
          </a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" />
              AI / LLM Developer in Progress
            </div>
            <h1>
              你好，我是
              <span className="formula">r=a(1−sinθ)</span>
            </h1>
            <p className="hero-quote">
              有目标的人才会迷路，
              <br />
              我只是来地球散步的。
            </p>
            <p className="hero-note">
              用代码理解原理，用实验记录成长。
              <br />
              正在把机器学习、深度学习与 LLM 变成可运行的作品。
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#projects">
                看看我的项目
                <ArrowIcon />
              </a>
              <a
                className="button secondary"
                href="https://github.com/lizhuofan-curry"
                target="_blank"
                rel="noreferrer"
              >
                <GitHubIcon />
                GitHub 主页
              </a>
            </div>
          </div>

          <div className="hero-art">
            <HeroCurve />
          </div>
        </div>
        <a className="scroll-hint" href="#about">
          <span>SCROLL TO WANDER</span>
          <span className="scroll-line" />
        </a>
      </section>

      <section className="section about" id="about">
        <div className="section-label">
          <span>01</span>
          <p>关于我</p>
        </div>
        <div className="about-content">
          <h2>
            在学习与构建之间，
            <br />
            留下一些可运行的痕迹。
          </h2>
          <div className="about-body">
            <p>
              我是一名正在构建 AI 全栈能力的学习者，关注机器学习、深度学习与大模型应用。
              比起只记住结论，我更喜欢通过自己的代码、真实输出和不断调试，慢慢摸清技术为什么有效。
            </p>
            <p>
              目前，我正在整理算法与机器学习知识体系，沉淀 PyTorch 实验与笔记，
              并尝试把 LLM 学习内容升级成可运行、可测试、可展示的工程项目。
            </p>
            <div className="about-meta">
              <div>
                <span>FOCUS</span>
                <strong>AI Engineering</strong>
              </div>
              <div>
                <span>METHOD</span>
                <strong>Build to learn</strong>
              </div>
              <div>
                <span>CURRENTLY</span>
                <strong>Keep exploring</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section projects" id="projects">
        <div className="section-heading">
          <div className="section-label">
            <span>02</span>
            <p>置顶项目</p>
          </div>
          <p className="section-intro">一些正在生长的学习记录与工程实践。</p>
        </div>
        <div className="project-list">
          {projects.map((project) => (
            <a
              className="project-card"
              href={project.href}
              target="_blank"
              rel="noreferrer"
              key={project.title}
            >
              <span className="project-index">{project.index}</span>
              <div className="project-main">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <span className="project-arrow">
                <ArrowIcon />
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="section skills" id="skills">
        <div className="section-label">
          <span>03</span>
          <p>技能地图</p>
        </div>
        <div className="skills-layout">
          <div className="skills-copy">
            <h2>持续扩展的工具箱</h2>
            <p>
              这里记录的是当前正在使用、练习或探索的技术，
              不是一张“全部精通”的清单。
            </p>
          </div>
          <div className="skill-grid">
            {skills.map((skill) => (
              <div className="skill-item" key={skill.name}>
                <span className="skill-group">{skill.group}</span>
                <strong>{skill.name}</strong>
                <span className="skill-level">{skill.level}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="closing">
        <div className="closing-orbit" aria-hidden="true" />
        <p>下一站，还在生成中</p>
        <h2>
          Stay curious.
          <br />
          Keep building.
        </h2>
        <a
          className="button primary"
          href="https://github.com/lizhuofan-curry"
          target="_blank"
          rel="noreferrer"
        >
          在 GitHub 继续散步
          <ArrowIcon />
        </a>
      </section>

      <footer>
        <a className="logo" href="#top">
          <span>r</span>=a(1−sinθ)
        </a>
        <p>在地球散步，也在代码里留下坐标。</p>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}
