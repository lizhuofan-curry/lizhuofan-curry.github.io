"use client";

import { useState } from "react";

const architectures = {
  cnn: { label: "CNN", title: "一条主路径，逐层提取特征。", description: "卷积、激活与池化沿单一路径前进。它是理解特征图尺寸、通道变化与分类头的基础。", code: "x = conv1(x)\nx = relu(x)\nx = pool(x)\nlogits = classifier(x)", nodes: ["INPUT", "CONV", "POOL", "LOGITS"] },
  inception: { label: "INCEPTION", title: "多条尺度并行，再沿通道汇合。", description: "同一输入进入不同卷积/池化分支；空间尺寸对齐后，使用 torch.cat(..., dim=1) 合并。", code: "branches = [branch1(x), branch3(x), pool(x)]\nout = torch.cat(branches, dim=1)", nodes: ["INPUT", "1×1", "3×3", "POOL", "CAT"] },
  resnet: { label: "RESNET", title: "学习变化 F(x)，也保留 identity。", description: "残差连接让信息沿捷径流动；当通道或尺寸变化时，用投影分支对齐 identity。", code: "identity = x\nout = conv2(relu(conv1(x)))\nout += identity\nout = relu(out)", nodes: ["INPUT", "F(x)", "+", "OUTPUT"] },
};

export default function ArchitectureLab() {
  const [selected, setSelected] = useState("cnn");
  const item = architectures[selected];
  return <section className="architecture-lab"><div className="lab-tabs" role="tablist" aria-label="选择网络结构">{Object.entries(architectures).map(([key, architecture]) => <button type="button" role="tab" aria-selected={selected === key} className={selected === key ? "active" : ""} onClick={() => setSelected(key)} key={key}>{architecture.label}</button>)}</div><div className="lab-workbench"><div><p className="label">LIVE STRUCTURE READER</p><h2>{item.title}</h2><p>{item.description}</p><p className="lab-boundary">这是结构阅读器，不是训练曲线或性能排行榜。</p></div><div className={`architecture-diagram ${selected}`} aria-label={`${item.label} 结构图`}>{item.nodes.map((node, index) => <div className="diagram-node" key={node} style={{ "--node": index }}>{node}</div>)}</div><pre><code>{item.code}</code></pre></div></section>;
}
