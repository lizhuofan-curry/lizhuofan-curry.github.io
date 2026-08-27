"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { EnvelopeSimple, GithubLogo, XLogo, BilibiliLogo } from "@phosphor-icons/react";
import { ThemeToggle } from "./ThemeToggle";
import { siteConfig } from "../_data/site";

const TABS = [
  { id: "me", label: "我" },
  { id: "articles", label: "文章" },
  { id: "projects", label: "小项目" },
  { id: "more", label: "更多" },
];

export function HomeCard({ articles, projects }) {
  const [active, setActive] = useState("me");
  const [dir, setDir] = useState("");
  const [speech, setSpeech] = useState({ text: "", show: false });
  const [sparkles, setSparkles] = useState([]);
  const avatarRef = useRef(null);
  const speechTimer = useRef(null);
  const envRef = useRef({ reduced: false });

  useEffect(() => {
    envRef.current = {
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    };
    return () => window.clearTimeout(speechTimer.current);
  }, []);

  function goto(tab) {
    if (tab === active) return;
    const order = TABS.map((t) => t.id);
    setDir(order.indexOf(tab) > order.indexOf(active) ? "slide-r" : "slide-l");
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
    setSparkles(
      Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.5;
        const dist = 32 + Math.random() * 24;
        return {
          id: Date.now() + i,
          sx: Math.cos(angle) * dist,
          sy: Math.sin(angle) * dist,
          x: frame.width / 2 - 4,
          y: frame.height / 2 - 4,
        };
      })
    );
    window.setTimeout(() => setSparkles([]), 700);
    const lines = ["你好呀！", "今天也在写代码。", "点上面 Tab 看看", "欢迎来做客！"];
    setSpeech({ text: lines[Math.floor(Math.random() * lines.length)], show: true });
    window.clearTimeout(speechTimer.current);
    speechTimer.current = window.setTimeout(() => setSpeech((p) => ({ ...p, show: false })), 1600);
  }

  return (
    <div className="home-card" data-active={active}>
      {/* 顶部导航 */}
      <nav className="home-nav" aria-label="首页导航">
        <div className="home-nav-tabs" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active === tab.id}
              className={active === tab.id ? "active" : ""}
              onClick={() => goto(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <ThemeToggle />
      </nav>

      {/* 我 */}
      <div className={`home-panel home-panel-me${active === "me" ? ` active ${dir}` : ""}`} role="tabpanel">
        <div className="home-avatar-wrap">
          <div className={`home-speech${speech.show ? " show" : ""}`} role="status">
            {speech.text || "你好呀！"}
          </div>
          <div className="home-avatar-frame">
            <Image
              ref={avatarRef}
              className="home-avatar"
              src="/doraemon-pixel-guide.png"
              alt="Zhuo 的像素头像"
              width={128}
              height={128}
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
          </div>
        </div>
        <h1 className="home-name">
          Zhuo<span>@zhuo</span>
        </h1>
        <p className="home-bio">写代码，也把过程写下来。</p>
        <div className="home-social">
          <a href={siteConfig.github} target="_blank" rel="noreferrer" aria-label="GitHub" data-name="GitHub">
            <GithubLogo size={20} weight="duotone" />
          </a>
          <a href={`mailto:${siteConfig.email}`} aria-label="邮件" data-name="邮件">
            <EnvelopeSimple size={20} weight="duotone" />
          </a>
        </div>
      </div>

      {/* 文章 */}
      <div className={`home-panel home-panel-list${active === "articles" ? ` active ${dir}` : ""}`} role="tabpanel">
        <h2 className="home-panel-title">文章</h2>
        <div className="home-list">
          {articles.map((article) => (
            <Link className="home-list-item" href={`/articles/${article.slug}`} key={article.slug}>
              <span className="home-list-dot" />
              <div className="home-list-body">
                <h3>{article.title}</h3>
                <p>
                  <span>#{article.category}</span>
                  <span>{article.readingTime}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 小项目 */}
      <div className={`home-panel home-panel-list${active === "projects" ? ` active ${dir}` : ""}`} role="tabpanel">
        <h2 className="home-panel-title">小项目</h2>
        <div className="home-project-grid">
          {projects.map((project) => (
            <Link className="home-project-card" href={`/projects/${project.slug}`} key={project.slug}>
              <span className="home-project-num">{project.number}</span>
              <span className="home-project-tag">{project.category}</span>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* 更多 */}
      <div className={`home-panel home-panel-more${active === "more" ? ` active ${dir}` : ""}`} role="tabpanel">
        <h2 className="home-panel-title">更多</h2>
        <div className="home-more-content">
          <p>在人工智能、计算机视觉和软件工程之间来回折腾。</p>
          <div className="home-more-tags">
            <span>AI</span>
            <span>CV</span>
            <span>LLM</span>
            <span>代码</span>
            <span>文章</span>
          </div>
          <div className="home-more-links">
            <Link href="/about">关于我</Link>
            <Link href="/articles">全部文章</Link>
            <Link href="/projects">全部项目</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
