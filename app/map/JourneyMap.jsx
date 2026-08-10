"use client";

import { useState } from "react";

const stops = [
  { id: "python", year: "01", title: "Python · 数据操作", description: "从读写数据、理解广播和预处理开始。这里的目标不是记住 API，而是让每段代码都有可观察的输入与输出。", links: ["广播机制", "数据预处理", "学习笔记"], proof: "关键词：数组形状、缺失值、对象转换。" },
  { id: "pytorch", year: "02", title: "PyTorch · 模型调试", description: "把设备、形状、前向传播和训练循环逐一拆开；每个 Traceback 都成为下一次判断的线索。", links: ["报错博物馆", "最小前向传播", "Restart Kernel + Run All"], proof: "已用干净进程验证 SimpleCNN、InceptionNet、ResNet 均可输出 (2, 10)。" },
  { id: "cnn", year: "03", title: "CNN · 结构与训练", description: "从 padding、通道数到分类头，理解卷积网络为什么能接住图像，也理解训练循环为什么会悄悄出错。", links: ["padding=1", "Conv2d", "train_model"], proof: "重点不是单次指标，而是数据划分、训练配置和曲线来源。" },
  { id: "architectures", year: "04", title: "Inception × ResNet", description: "用同一 CIFAR-10 流程阅读三种架构：分支怎样沿通道拼接，残差怎样让 identity 参与计算。", links: ["torch.cat(..., dim=1)", "out += identity", "架构实验台"], proof: "训练：45,000；验证：5,000；测试：10,000；seed 42；20 epochs。" },
  { id: "vision", year: "05", title: "Computer Vision · 闭环", description: "从 CNN、Inception、ResNet 的结构阅读，走向分类、去噪、检索与 Web 推理，把模型放进实际流程里。", links: ["智图寻宝", "U-Net", "KNN", "Flask"], proof: "项目强调从数据、权重、特征库到结果解释的完整路径。" },
  { id: "product", year: "06", title: "AI Product · 问渠", description: "不只训练模型，也思考用户如何阅读、回忆、复盘，以及证据如何留在系统里。", links: ["问渠 Wenqu", "材料地图", "阅读档案"], proof: "设计重点：原文证据、双轨跟读、主动回忆与错因诊断。" },
  { id: "llm", year: "07", title: "LLM Engineering · 继续走", description: "把 Provider、测试、CI、RAG 与 Agent 工作流连接起来，持续往可靠的软件靠近。", links: ["LLM FullStack", "FastAPI", "LangGraph", "Now"], proof: "下一步仍以可运行、可检查、可记录为标准。" },
];

export default function JourneyMap() { const [selected, setSelected] = useState("pytorch"); const stop = stops.find((item) => item.id === selected); return <section className="journey-map"><div className="map-rail" role="tablist" aria-label="成长地图节点">{stops.map((item) => <button key={item.id} type="button" role="tab" aria-selected={item.id === selected} className={item.id === selected ? "active" : ""} onClick={() => setSelected(item.id)}><span>{item.year}</span><strong>{item.title}</strong></button>)}</div><article className="map-detail"><p className="label">CURRENT STOP / {stop.year}</p><h2>{stop.title}</h2><p>{stop.description}</p><div>{stop.links.map((link) => <span key={link}>{link}</span>)}</div><p className="map-proof"><span>FIELD NOTE</span>{stop.proof}</p></article></section>; }
