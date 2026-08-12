"use client";

import { useRef } from "react";

const leaves = [
  [114, 262, -34, "Python"], [173, 199, 36, "PyTorch"], [246, 244, -27, "Vision"],
  [303, 151, 30, "React"], [378, 209, -25, "LLM"], [434, 116, 34, "RAG"],
  [512, 177, -28, "Evidence"], [578, 92, 24, "Curiosity"], [642, 152, -25, "Build"],
];

export function GrowingGarden() {
  const ref = useRef(null);
  function move(event) {
    const rect = ref.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    ref.current.style.setProperty("--garden-x", x.toFixed(2));
    ref.current.style.setProperty("--garden-y", y.toFixed(2));
  }
  return <div ref={ref} className="garden-visual" onPointerMove={move} onPointerLeave={() => { ref.current.style.setProperty("--garden-x", 0); ref.current.style.setProperty("--garden-y", 0); }}>
    <div className="garden-label"><span>LIVE SPECIMEN</span><b>代码花园 / 01</b></div>
    <svg viewBox="0 0 720 390" role="img" aria-labelledby="garden-title garden-desc">
      <title id="garden-title">会生长的代码花园</title><desc id="garden-desc">由学习主题组成的抽象枝叶图形，指针靠近时会轻微舒展。</desc>
      <path className="stem main-stem" d="M76 354 C145 310 158 260 219 235 C288 207 285 162 355 163 C423 164 451 111 514 120 C582 129 606 71 674 57" />
      <path className="stem branch" d="M205 241 C172 228 154 201 145 168 M349 165 C333 129 344 100 371 72 M503 121 C521 94 526 64 521 38 M576 99 C607 107 629 106 657 92" />
      {leaves.map(([x,y,r,label], index) => <g className={`leaf leaf-${index + 1}`} key={label} transform={`translate(${x} ${y}) rotate(${r})`}><ellipse rx="47" ry="22" /><path d="M-34 0 H34"/><text y="4" textAnchor="middle" transform={`rotate(${-r})`}>{label}</text></g>)}
      <circle className="seed" cx="76" cy="354" r="14"/><circle className="sun" cx="626" cy="47" r="29" />
    </svg>
    <p>移动指针，让学习路径轻轻舒展。</p>
  </div>;
}
