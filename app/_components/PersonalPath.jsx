"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { articles } from "../_data/articles";
import { projects } from "../_data/site-data";

const signals = [
  { id: "product", label: "AI 产品" },
  { id: "vision", label: "计算机视觉" },
  { id: "llm", label: "LLM 工程" },
  { id: "structure", label: "模型结构" },
  { id: "debug", label: "调试方法" },
  { id: "evidence", label: "实验与证据" },
];

const stopSeeds = [
  { slug: "read-traceback", type: "文章", description: "先学会把失败缩小成一个可以继续行动的问题。", signals: ["debug", "evidence"] },
  { slug: "wenqu", type: "项目", description: "看 AI 阅读如何回到原文，并留下学习过程的证据。", signals: ["product", "llm", "evidence"] },
  { slug: "shop-vision", type: "项目", description: "从模型能力走到一次完整、可操作的视觉产品流程。", signals: ["product", "vision"] },
  { slug: "inception-branches", type: "文章", description: "从 torch.cat 理解多尺度分支与通道变化。", signals: ["vision", "structure"] },
  { slug: "resnet-identity", type: "文章", description: "顺着残差路径理解信息如何穿过更深的网络。", signals: ["vision", "structure"] },
  { slug: "cnn-architectures", type: "项目", description: "在统一实验流程里对照三种经典视觉网络。", signals: ["vision", "structure", "evidence"] },
  { slug: "validation-is-not-test", type: "文章", description: "把模型选择、训练曲线和最终结论的边界分清楚。", signals: ["evidence", "debug"] },
  { slug: "llm-fullstack", type: "项目", description: "沿着 Provider、测试、RAG 与 Agent 走向可靠软件。", signals: ["llm", "product", "debug"] },
];

const articleBySlug = new Map(articles.map((article) => [article.slug, article]));
const projectBySlug = new Map(projects.map((project) => [project.slug, project]));

const stops = stopSeeds.map((seed) => {
  const isArticle = seed.type === "文章";
  const source = (isArticle ? articleBySlug : projectBySlug).get(seed.slug);
  return {
    type: seed.type,
    title: source?.title ?? seed.slug,
    description: seed.description,
    href: `/${isArticle ? "articles" : "projects"}/${seed.slug}`,
    signals: seed.signals,
  };
});

const defaultRoute = ["read-traceback", "cnn-architectures", "wenqu"];

function readPath() {
  if (typeof window === "undefined") return [];
  const allowed = new Set(signals.map((signal) => signal.id));
  return (new URLSearchParams(window.location.search).get("path") || "")
    .split(",")
    .filter((value) => allowed.has(value))
    .slice(0, 3);
}

function stopSlug(stop) {
  return stop.href.split("/").filter(Boolean).pop();
}

export function PersonalPath() {
  const [selected, setSelected] = useState([]);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const restore = () => setSelected(readPath());
    restore();
    setReady(true);
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);

  const route = useMemo(() => {
    if (!selected.length) return defaultRoute.map((slug) => stops.find((stop) => stopSlug(stop) === slug));
    const ranked = stops
      .map((stop, index) => ({ ...stop, score: stop.signals.filter((signal) => selected.includes(signal)).length * 10 - index * 0.01 }))
      .filter((stop) => stop.score > 0)
      .sort((a, b) => b.score - a.score);
    const fallback = defaultRoute
      .map((slug) => stops.find((stop) => stopSlug(stop) === slug))
      .filter((stop) => !ranked.some((candidate) => candidate.href === stop.href));
    return [...ranked, ...fallback].slice(0, 3);
  }, [selected]);

  function writePath(next) {
    setSelected(next);
    setMessage("");
    const url = new URL(window.location.href);
    if (next.length) url.searchParams.set("path", next.join(","));
    else url.searchParams.delete("path");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }

  function toggleSignal(id) {
    if (selected.includes(id)) return writePath(selected.filter((value) => value !== id));
    if (selected.length === 3) {
      setMessage("最多选择 3 个兴趣信号。");
      return;
    }
    writePath([...selected, id]);
  }

  async function copyRoute() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage("路线链接已复制。");
    } catch {
      setMessage("路线已写入地址栏，可以直接复制链接。");
    }
  }

  const routeKey = selected.length ? selected.join("-") : "overview";

  return (
    <section className="personal-path" aria-labelledby="personal-path-title">
      <div className="path-intro">
        <p>按兴趣探索</p>
        <h2 id="personal-path-title">生成一条<br />属于你的路线。</h2>
        <p className="path-description">选择你关心的方向，我会从现有文章和项目中连接出三个起点。</p>
        <div className="path-signals" aria-label="选择兴趣方向">
          {signals.map((signal) => (
            <button type="button" className={selected.includes(signal.id) ? "active" : ""} aria-pressed={selected.includes(signal.id)} onClick={() => toggleSignal(signal.id)} key={signal.id}>
              {signal.label}
            </button>
          ))}
        </div>
        <div className="path-actions">
          <button type="button" onClick={() => writePath([])} disabled={!selected.length}>回到默认路线</button>
          <button type="button" onClick={copyRoute}>复制路线链接</button>
        </div>
        <p className="path-message" aria-live="polite">{message || (selected.length ? `已连接 ${selected.length} 个兴趣信号` : "默认路线：调试、结构、产品")}</p>
      </div>

      <ol className={`path-route ${ready ? "ready" : ""}`} key={routeKey} aria-label="推荐探索路线">
        {route.map((stop, index) => (
          <li key={stop.href} style={{ "--path-index": index }}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <small>{stop.type}</small>
              <h3>{stop.title}</h3>
              <p>{stop.description}</p>
              <Link href={stop.href}>从这里开始 <span aria-hidden="true">↗</span></Link>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
