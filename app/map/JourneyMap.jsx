"use client";

import { useState } from "react";

const stops = [
  { id: "python", year: "01", title: "Python · 数据操作", description: "从能读写数据、理解广播和预处理开始，把抽象概念变成可运行的小实验。", links: ["数据处理练习", "学习笔记"] },
  { id: "pytorch", year: "02", title: "PyTorch · 模型调试", description: "把设备、形状、前向传播和训练循环逐一拆开；每个 Traceback 都成为下一次判断的线索。", links: ["报错博物馆", "模型实验"] },
  { id: "vision", year: "03", title: "Computer Vision · 闭环", description: "从 CNN、Inception、ResNet 的结构阅读，走向分类、去噪、检索与 Web 推理。", links: ["架构实验台", "智图寻宝"] },
  { id: "product", year: "04", title: "AI Product · 问渠", description: "不只训练模型，也思考用户如何阅读、回忆、复盘，以及证据如何留在系统里。", links: ["问渠 Wenqu", "项目档案"] },
  { id: "llm", year: "05", title: "LLM Engineering · 继续走", description: "把 Provider、测试、CI、RAG 与 Agent 工作流连接起来，持续往可靠的软件靠近。", links: ["LLM FullStack", "Now"] },
];

export default function JourneyMap() { const [selected, setSelected] = useState("pytorch"); const stop = stops.find((item) => item.id === selected); return <section className="journey-map"><div className="map-rail" role="tablist" aria-label="成长地图节点">{stops.map((item) => <button key={item.id} type="button" role="tab" aria-selected={item.id === selected} className={item.id === selected ? "active" : ""} onClick={() => setSelected(item.id)}><span>{item.year}</span><strong>{item.title}</strong></button>)}</div><article className="map-detail"><p className="label">CURRENT STOP / {stop.year}</p><h2>{stop.title}</h2><p>{stop.description}</p><div>{stop.links.map((link) => <span key={link}>{link}</span>)}</div></article></section>; }
