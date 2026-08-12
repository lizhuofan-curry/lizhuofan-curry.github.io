"use client";

import { useRef } from "react";

const signals = [
  [116, 278, "Python", 1], [196, 215, "PyTorch", 2], [284, 264, "Vision", 3],
  [350, 165, "React", 2], [438, 220, "LLM", 4], [520, 132, "RAG", 2],
  [588, 198, "Evidence", 3], [646, 92, "Build", 1],
];

export function SignalField() {
  const ref = useRef(null);
  function move(event) {
    const rect = ref.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    ref.current.style.setProperty("--signal-x", x.toFixed(2));
    ref.current.style.setProperty("--signal-y", y.toFixed(2));
  }
  function reset() {
    ref.current.style.setProperty("--signal-x", 0);
    ref.current.style.setProperty("--signal-y", 0);
  }
  return <div ref={ref} className="signal-visual" onPointerMove={move} onPointerLeave={reset}>
    <div className="signal-label"><span>LIVE SIGNAL MAP</span><b>学习信号场 / 01</b></div>
    <svg viewBox="0 0 720 390" role="img" aria-labelledby="signal-title signal-desc">
      <title id="signal-title">互动学习信号场</title><desc id="signal-desc">学习主题以节点和轨道连接成一张抽象信号图，指针移动时会产生轻微位移。</desc>
      <ellipse className="orbit orbit-a" cx="360" cy="205" rx="290" ry="128" />
      <ellipse className="orbit orbit-b" cx="370" cy="205" rx="222" ry="86" />
      <path className="signal-line line-a" d="M72 326 C158 283 195 226 278 251 C355 274 377 186 444 208 C508 230 552 151 648 90" />
      <path className="signal-line line-b" d="M118 277 C206 310 281 250 350 165 C421 78 517 114 588 198" />
      {signals.map(([x,y,label,level], index) => <g className={`signal-node signal-node-${index + 1}`} key={label} transform={`translate(${x} ${y})`}><circle className="node-ring" r={22 + level * 3}/><circle className="node-core" r={5 + level}/><text y={40 + level * 3} textAnchor="middle">{label}</text></g>)}
      <g className="cursor-pulse" transform="translate(72 326)"><circle r="18"/><circle r="6"/></g>
      <text className="coordinate" x="535" y="354">x: curiosity / y: evidence</text>
    </svg>
    <p>移动指针，观察知识信号之间的关系。</p>
  </div>;
}
