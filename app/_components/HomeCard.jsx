"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { EnvelopeSimple, GithubLogo } from "@phosphor-icons/react";
import { ThemeToggle } from "./ThemeToggle";
import { siteConfig } from "../_data/site";

const TAB_ORDER = ["me", "articles", "projects", "about"];
const TAB_LABELS = { me: "首页", articles: "文章", projects: "项目", about: "关于" };
const SPEECH_LINES = ["你好呀！", "今天也在写代码。", "点上面 Tab 看看 ↗", "点我可以再跳一次～", "欢迎来做客！"];

export function HomeCard({ articles, projects }) {
  const [active, setActive] = useState("me");
  const [dir, setDir] = useState("");
  const [speech, setSpeech] = useState({ text: "", show: false });
  const [clock, setClock] = useState("--:--");
  const [sparkles, setSparkles] = useState([]);
  const avatarRef = useRef(null);
  const speechTimer = useRef(null);
  const envRef = useRef({ reduced: false, fine: false });

  useEffect(() => {
    envRef.current = {
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      fine: window.matchMedia("(pointer:fine)").matches,
    };
    const tick = () => {
      const d = new Date();
      setClock(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
    };
    tick();
    const timer = window.setInterval(tick, 15000);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(speechTimer.current);
    };
  }, []);

  function goto(tab) {
    if (tab === active) return;
    setDir(TAB_ORDER.indexOf(tab) > TAB_ORDER.indexOf(active) ? "slide-r" : "slide-l");
    setActive(tab);
  }

  function handleAvatarClick() {
    if (envRef.current.reduced) return;
    const avatar = avatarRef.current;
    if (!avatar) return;
    avatar.classList.remove("hop");
    void avatar.offsetWidth;
    avatar.classList.add("hop");
    const frame = avatar.parentElement?.getBoundingClientRect();
    if (!frame) return;
    const newSparkles = Array.from({ length: 6 }, (_, i) => {
      const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 36 + Math.random() * 28;
      return {
        id: Date.now() + i,
        sx: Math.cos(angle) * dist,
        sy: Math.sin(angle) * dist,
        x: frame.width / 2 - 5,
        y: frame.height / 2 - 5,
      };
    });
    setSparkles(newSparkles);
    window.setTimeout(() => setSparkles([]), 750);
    setSpeech({ text: SPEECH_LINES[Math.floor(Math.random() * SPEECH_LINES.length)], show: true });
    window.clearTimeout(speechTimer.current);
    speechTimer.current = window.setTimeout(() => setSpeech((prev) => ({ ...prev, show: false })), 1700);
  }

  return (
    <div className="home-wrapper" data-active={active}>
      {/* 顶部导航 */}
      <nav className="home-nav" aria-label="首页导航">
        <div className="home-nav-inner">
          {TAB_ORDER.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={active === tab}
              className={`home-nav-item${active === tab ? " active" : ""}`}
              onClick={() => goto(tab)}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
        <ThemeToggle />
      </nav>

      {/* 首页面板 */}
      <div className={`home-panel home-panel-me${active === "me" ? ` active ${dir}` : ""}`} role="tabpanel">
        <div className="home-avatar-side">
          <div className={`home-speech${speech.show ? " show" : ""}`} role="status">{speech.text || "你好呀！"}</div>
          <div className="home-avatar-frame">
            <Image
              ref={avatarRef}
              className="home-avatar"
              src="/doraemon-pixel-guide.png"
              alt="Zhuo 的像素头像"
              width={120}
              height={120}
              draggable={false}
              onClick={handleAvatarClick}
              priority
            />
            {sparkles.map((s) => (
              <span
                key={s.id}
                className="home-sparkle"
                style={{ "--sx": `${s.sx}px`, "--sy": `${s.sy}px`, left: s.x, top: s.y }}
              />
            ))}
            <span className="home-live-dot" title="在线" />
          </div>
        </div>
        <h1 className="home-name">Zhuo<span>@zhuo</span></h1>
        <p className="home-tagline">写代码，也把过程写下来。</p>
        <div className="home-social">
          <button type="button" onClick={() => goto("articles")} data-name="文章">
            <span>文</span>
          </button>
          <button type="button" onClick={() => goto("projects")} data-name="项目">
            <span>项</span>
          </button>
          <button type="button" onClick={() => goto("about")} data-name="关于">
            <span>关</span>
          </button>
          <a href={siteConfig.github} target="_blank" rel="noreferrer" aria-label="GitHub" data-name="GitHub">
            <GithubLogo size={20} weight="duotone" />
          </a>
          <a href={`mailto:${siteConfig.email}`} aria-label="邮件" data-name="邮件">
            <EnvelopeSimple size={20} weight="duotone" />
          </a>
        </div>
        <div className="home-mini-status">
          <span><i className="home-dot-live" />正在写代码</span>
          <span>当地时间 <b>{clock}</b></span>
        </div>
      </div>

      {/* 文章面板 */}
      <div className={`home-panel home-panel-list${active === "articles" ? ` active ${dir}` : ""}`} role="tabpanel">
        <div className="home-panel-head">
          <h2>文章</h2>
          <span className="count">最近更新 {articles.length} 篇</span>
        </div>
        <div className="home-article-rows">
          {articles.map((article) => (
            <Link className="home-article-row" href={`/articles/${article.slug}`} key={article.slug}>
              <span className="r-dot" aria-hidden="true" />
              <div className="r-body">
                <h3>{article.title}</h3>
                <div className="meta">
                  <span className="tag">#{article.category}</span>
                  <span>{article.readingTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Link className="home-panel-more" href="/articles">全部文章 →</Link>
      </div>

      {/* 项目面板 */}
      <div className={`home-panel home-panel-list${active === "projects" ? ` active ${dir}` : ""}`} role="tabpanel">
        <div className="home-panel-head">
          <h2>项目</h2>
          <span className="count">{projects.length} 个已解锁</span>
        </div>
        <div className="home-project-grid">
          {projects.map((project) => (
            <Link className="home-project-tile" href={`/projects/${project.slug}`} key={project.slug}>
              <span className="num">{project.number}</span>
              <span className="pill">{project.category}</span>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
            </Link>
          ))}
        </div>
        <Link className="home-panel-more" href="/projects">全部项目 →</Link>
      </div>

      {/* 关于面板 */}
      <div className={`home-panel home-panel-about${active === "about" ? ` active ${dir}` : ""}`} role="tabpanel">
        <div className="home-panel-head">
          <h2>关于</h2>
          <span className="count">@zhuo</span>
        </div>
        <div className="home-about-copy">
          <p><strong>Zhuo</strong>，在人工智能、计算机视觉和软件工程之间来回折腾。这个站记录<em>我做过的事和学到的东西</em>。</p>
        </div>
        <div className="home-about-tags">
          <span>AI · CV · LLM</span>
          <span>代码 · 文章</span>
          <span>持续构建</span>
        </div>
        <Link className="home-panel-more" href="/about">完整介绍 →</Link>
      </div>
    </div>
  );
}
