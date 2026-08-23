"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { projects } from "../_data/site-data";

const signals = [
  { id: "product", label: "AI 产品", terms: ["产品", "全栈", "应用", "provider", "rag", "agent"] },
  { id: "vision", label: "计算机视觉", terms: ["视觉", "cv", "cnn", "图像", "resnet", "inception"] },
  { id: "llm", label: "LLM 工程", terms: ["llm", "大模型", "rag", "agent", "prompt"] },
  { id: "structure", label: "模型结构", terms: ["结构", "模型", "pytorch", "卷积", "resnet", "inception"] },
  { id: "debug", label: "调试方法", terms: ["调试", "debug", "traceback", "错误", "维护"] },
  { id: "evidence", label: "实验与证据", terms: ["证据", "实验", "验证", "测试", "metrics"] },
];

const defaultSlugs = ["read-traceback", "cnn-architectures", "wenqu"];
const PATH_EVENT = "zhuo-path-change";

function subscribeToLocation(callback) {
  window.addEventListener("popstate", callback);
  window.addEventListener(PATH_EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(PATH_EVENT, callback);
  };
}

function locationSnapshot() {
  return window.location.search;
}

function readPath(search) {
  const allowed = new Set(signals.map((signal) => signal.id));
  return (new URLSearchParams(search).get("path") || "")
    .split(",")
    .filter((value) => allowed.has(value))
    .slice(0, 3);
}

function signalIdsFor(item) {
  const haystack = [item.title, item.description, item.category, ...(item.tags || []), ...(item.keywords || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return signals.filter((signal) => signal.terms.some((term) => haystack.includes(term))).map((signal) => signal.id);
}

function buildStops(articles) {
  const articleStops = articles.map((article) => ({
    slug: article.slug,
    type: "文章",
    title: article.title,
    description: article.description,
    href: `/articles/${article.slug}`,
    signals: signalIdsFor(article),
  }));
  const projectStops = projects.map((project) => ({
    slug: project.slug,
    type: "项目",
    title: project.title,
    description: project.summary,
    href: `/projects/${project.slug}`,
    signals: signalIdsFor({ ...project, description: project.summary }),
  }));
  const interleaved = [];
  const length = Math.max(articleStops.length, projectStops.length);
  for (let index = 0; index < length; index += 1) {
    if (articleStops[index]) interleaved.push(articleStops[index]);
    if (projectStops[index]) interleaved.push(projectStops[index]);
  }
  return interleaved;
}

export function PersonalPath({ articles }) {
  const search = useSyncExternalStore(subscribeToLocation, locationSnapshot, () => "");
  const selected = useMemo(() => readPath(search), [search]);
  const [message, setMessage] = useState("");
  const stops = useMemo(() => buildStops(articles), [articles]);

  const defaultRoute = useMemo(() => {
    const preferred = defaultSlugs.map((slug) => stops.find((stop) => stop.slug === slug)).filter(Boolean);
    return [...preferred, ...stops.filter((stop) => !preferred.includes(stop))].slice(0, 3);
  }, [stops]);

  const route = useMemo(() => {
    if (!selected.length) return defaultRoute;
    const ranked = stops
      .map((stop, index) => ({ ...stop, score: stop.signals.filter((signal) => selected.includes(signal)).length * 10 - index * 0.01 }))
      .filter((stop) => stop.score > 0)
      .sort((a, b) => b.score - a.score);
    return [...ranked, ...defaultRoute.filter((stop) => !ranked.some((candidate) => candidate.href === stop.href))].slice(0, 3);
  }, [defaultRoute, selected, stops]);

  function writePath(next) {
    setMessage("");
    const url = new URL(window.location.href);
    if (next.length) url.searchParams.set("path", next.join(","));
    else url.searchParams.delete("path");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    window.dispatchEvent(new Event(PATH_EVENT));
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

  if (!route.length) return null;

  return (
    <section className="personal-path" aria-labelledby="personal-path-title">
      <div className="path-intro">
        <p className="section-kicker">按兴趣探索</p>
        <h2 id="personal-path-title">生成一条<br />属于你的路线。</h2>
        <p className="path-description">选择你关心的方向，从当前已发布的文章和项目中连接出三个起点。</p>
        <div className="path-signals" role="group" aria-label="选择兴趣方向">
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
        <p className="path-message" role="status">{message || (selected.length ? `已连接 ${selected.length} 个兴趣信号` : "默认路线：调试、结构、产品")}</p>
      </div>

      <ol className="path-route" aria-label="推荐探索路线">
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
