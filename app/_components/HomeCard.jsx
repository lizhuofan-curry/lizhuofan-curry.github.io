"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { EnvelopeSimple, GithubLogo } from "@phosphor-icons/react";
import { ThemeToggle } from "./ThemeToggle";
import { siteConfig } from "../_data/site";

const TAB_ORDER = ["me", "articles", "projects", "about"];
const TAB_LABELS = { me: "我", articles: "文章", projects: "项目", about: "关于" };
const SPEECH_LINES = ["你好呀！", "今天也在写代码。", "点上面 Tab 看看 ↗", "点我可以再跳一次～", "欢迎来做客！"];
const COVER_EMOJI = ["🧠", "🛠️", "🔦", "📏"];

export function HomeCard({ articles, projects }) {
  const [active, setActive] = useState("me");
  const [dir, setDir] = useState("");
  const [speech, setSpeech] = useState({ text: "", show: false });
  const [clock, setClock] = useState("--:--");
  const cardRef = useRef(null);
  const avatarRef = useRef(null);
  const frameRef = useRef(null);
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

  function handleCardMove(event) {
    if (active !== "me" || !envRef.current.fine || envRef.current.reduced) return;
    const card = cardRef.current;
    const avatar = avatarRef.current;
    const frame = frameRef.current;
    if (!card || !avatar || !frame) return;
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-py * 3}deg) rotateY(${px * 4}deg)`;
    const fr = frame.getBoundingClientRect();
    const cx = fr.left + fr.width / 2;
    const cy = fr.top + fr.height / 2;
    const dx = Math.max(-1, Math.min(1, (event.clientX - cx) / 260));
    const dy = Math.max(-1, Math.min(1, (event.clientY - cy) / 260));
    avatar.style.transform = `translate(${dx * 7}px, ${dy * 7}px) rotate(${dx * 5}deg)`;
  }

  function handleCardLeave() {
    if (cardRef.current) cardRef.current.style.transform = "";
    if (avatarRef.current) avatarRef.current.style.transform = "";
  }

  function handleAvatarClick() {
    if (envRef.current.reduced) return;
    const avatar = avatarRef.current;
    const frame = frameRef.current;
    if (!avatar || !frame) return;
    avatar.classList.remove("hop");
    void avatar.offsetWidth;
    avatar.classList.add("hop");
    const fr = frame.getBoundingClientRect();
    for (let i = 0; i < 8; i += 1) {
      const sparkle = document.createElement("span");
      sparkle.className = "home-sparkle";
      const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 46 + Math.random() * 36;
      sparkle.style.setProperty("--sx", `${Math.cos(angle) * dist}px`);
      sparkle.style.setProperty("--sy", `${Math.sin(angle) * dist}px`);
      sparkle.style.left = `${fr.width / 2 - 5}px`;
      sparkle.style.top = `${fr.height / 2 - 5}px`;
      frame.appendChild(sparkle);
      window.setTimeout(() => sparkle.remove(), 750);
    }
    setSpeech({ text: SPEECH_LINES[Math.floor(Math.random() * SPEECH_LINES.length)], show: true });
    window.clearTimeout(speechTimer.current);
    speechTimer.current = window.setTimeout(() => setSpeech((prev) => ({ ...prev, show: false })), 1700);
  }

  const noticeText = "新视觉逐步上线中，欢迎四处逛逛 · 最近在读《深度学习》并做配套实验 · 有什么想聊的可以留言 · ";

  return (
    <div
      ref={cardRef}
      className="home-card"
      data-active={active}
      onPointerMove={handleCardMove}
      onPointerLeave={handleCardLeave}
    >
      <div className="home-card-top">
        <ThemeToggle />
        <div className="home-tabs" role="tablist" aria-label="首页内容切换">
          {TAB_ORDER.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={active === tab}
              className={active === tab ? "active" : ""}
              onClick={() => goto(tab)}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
        <span className="spacer" aria-hidden="true" />
      </div>

      <div className="home-panels">
        <div className={`home-panel${active === "me" ? ` active ${dir}` : ""}`} role="tabpanel">
          <div className="home-avatar-side">
            <div className={`home-speech${speech.show ? " show" : ""}`} role="status">{speech.text || "你好呀！"}</div>
            <div className="home-avatar-frame" ref={frameRef}>
              <Image
                ref={avatarRef}
                className="home-avatar"
                src="/doraemon-pixel-guide.png"
                alt="Zhuo 的像素头像"
                width={156}
                height={156}
                draggable={false}
                onClick={handleAvatarClick}
                priority
              />
              <span className="home-live-dot" title="在线" />
            </div>
            <span className="home-twinkle t1" aria-hidden="true">✦</span>
            <span className="home-twinkle t2" aria-hidden="true">✦</span>
            <p className="home-avatar-hint">点我一下试试 👆</p>
          </div>
          <div className="home-name-row">
            <h1>Zhuo</h1>
            <span className="handle">@zhuo</span>
          </div>
          <p className="home-tagline">写代码，也把过程写下来。</p>
          <div className="mini-status home-mini-status">
            <span><i className="home-dot-live" />正在写代码</span>
            <span>当地时间 <b>{clock}</b></span>
          </div>
          <div className="home-entries">
            <button className="home-entry" type="button" onClick={() => goto("articles")} aria-label="查看文章">📖<span className="tip">文章</span></button>
            <button className="home-entry" type="button" onClick={() => goto("projects")} aria-label="查看项目">🗺️<span className="tip">项目</span></button>
            <button className="home-entry" type="button" onClick={() => goto("about")} aria-label="关于 Zhuo">👤<span className="tip">关于</span></button>
            <a className="home-entry" href={siteConfig.github} target="_blank" rel="noreferrer" aria-label="GitHub 主页"><GithubLogo size={22} weight="duotone" /><span className="tip">GitHub</span></a>
            <a className="home-entry" href={`mailto:${siteConfig.email}`} aria-label="发送邮件"><EnvelopeSimple size={22} weight="duotone" /><span className="tip">邮件</span></a>
          </div>
          <div className="home-notice">
            <span className="bell" aria-hidden="true">🔔</span>
            <div className="mask"><span className="track">{noticeText}{noticeText}</span></div>
          </div>
        </div>

        <div className={`home-panel${active === "articles" ? ` active ${dir}` : ""}`} role="tabpanel">
          <div className="home-panel-head">
            <h2>文章</h2>
            <span className="count">最近更新 {articles.length} 篇</span>
          </div>
          <div className="home-article-rows">
            {articles.map((article, index) => (
              <Link className="home-article-row" href={`/articles/${article.slug}`} key={article.slug}>
                <div className="r-body">
                  <h3>{article.title}</h3>
                  <div className="meta">
                    <span className="tag">#{article.category}</span>
                    <span>{article.readingTime}</span>
                  </div>
                </div>
                <div className="r-cover" aria-hidden="true">{COVER_EMOJI[index % COVER_EMOJI.length]}</div>
              </Link>
            ))}
          </div>
          <Link className="home-panel-more" href="/articles">全部文章 →</Link>
        </div>

        <div className={`home-panel${active === "projects" ? ` active ${dir}` : ""}`} role="tabpanel">
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

        <div className={`home-panel${active === "about" ? ` active ${dir}` : ""}`} role="tabpanel">
          <div className="home-panel-head">
            <h2>关于</h2>
            <span className="count">@zhuo</span>
          </div>
          <div className="home-about-copy">
            <p><strong>Zhuo</strong>，在人工智能、计算机视觉和软件工程之间来回折腾。这个站不是答案陈列，而是<em>一次理解如何形成</em>的记录——每篇文章都尽量附上可核验的过程与证据。</p>
          </div>
          <div className="home-about-facts">
            <div><b>AI · CV · LLM</b><span>正在练习</span></div>
            <div><b>代码 · 文章</b><span>记录方式</span></div>
            <div><b>证据优先</b><span>写作原则</span></div>
          </div>
          <Link className="home-panel-more" href="/about">完整介绍 →</Link>
        </div>
      </div>
    </div>
  );
}
