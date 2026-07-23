"use client";

import { useRef } from "react";

function buildCardioidPath(samples = 360) {
  const points = [];

  for (let index = 0; index <= samples; index += 1) {
    const theta = (index / samples) * Math.PI * 2;
    const radius = 92 * (1 - Math.sin(theta));
    const x = radius * Math.cos(theta);
    const y = -radius * Math.sin(theta);
    points.push(`${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }

  return `${points.join(" ")} Z`;
}

const cardioidPath = buildCardioidPath();

const particles = [
  ["12%", "22%", "4px", "0s", "8s"],
  ["83%", "18%", "3px", "-2s", "9s"],
  ["90%", "62%", "5px", "-5s", "11s"],
  ["18%", "78%", "3px", "-3s", "7s"],
  ["71%", "88%", "2px", "-6s", "10s"],
  ["48%", "9%", "2px", "-1s", "8s"],
  ["6%", "53%", "2px", "-4s", "9s"],
];

export default function HeroCurve() {
  const sceneRef = useRef(null);

  function handlePointerMove(event) {
    const scene = sceneRef.current;
    if (!scene) return;

    const bounds = scene.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    scene.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
    scene.style.setProperty("--tilt-y", `${(x * 7).toFixed(2)}deg`);
    scene.style.setProperty("--glow-x", `${(50 + x * 22).toFixed(2)}%`);
    scene.style.setProperty("--glow-y", `${(50 + y * 22).toFixed(2)}%`);
  }

  function resetPointer() {
    const scene = sceneRef.current;
    if (!scene) return;

    scene.style.setProperty("--tilt-x", "0deg");
    scene.style.setProperty("--tilt-y", "0deg");
    scene.style.setProperty("--glow-x", "50%");
    scene.style.setProperty("--glow-y", "50%");
  }

  return (
    <div
      className="curve-scene"
      ref={sceneRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="curve-aura" />
      <div className="curve-frame">
        <div className="curve-header">
          <span>
            <i />
            POLAR STUDY
          </span>
          <span>θ ∈ [0, 2π]</span>
        </div>

        <svg
          className="curve-plot"
          viewBox="-190 -155 380 380"
          role="img"
          aria-label="极坐标函数 r 等于 a 乘以一减正弦 theta 的动态心脏线"
        >
          <defs>
            <linearGradient id="curve-stroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#b9edff" />
              <stop offset="0.48" stopColor="#48b3df" />
              <stop offset="1" stopColor="#176f9e" />
            </linearGradient>
            <radialGradient id="curve-fill" cx="50%" cy="28%" r="72%">
              <stop offset="0" stopColor="#dff7ff" stopOpacity=".82" />
              <stop offset="1" stopColor="#69c5e7" stopOpacity=".08" />
            </radialGradient>
            <filter id="curve-glow" x="-70%" y="-70%" width="240%" height="240%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="point-glow" x="-400%" y="-400%" width="800%" height="800%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g className="plot-grid">
            <circle r="54" />
            <circle r="108" />
            <circle r="162" />
            <path d="M-176 0H176M0-145V208" />
            <path d="M-124-124L124 124M124-124L-124 124" />
          </g>

          <g className="plot-ticks">
            <text x="164" y="-8">0</text>
            <text x="7" y="-132">π/2</text>
            <text x="-178" y="-8">π</text>
            <text x="7" y="196">3π/2</text>
          </g>

          <path className="curve-echo echo-one" d={cardioidPath} />
          <path className="curve-echo echo-two" d={cardioidPath} />
          <path className="curve-fill" d={cardioidPath} />
          <path
            className="curve-line"
            id="cardioid-motion-path"
            pathLength="1"
            d={cardioidPath}
          />

          <g className="moving-point" filter="url(#point-glow)">
            <circle r="9" fill="#63c9ed" fillOpacity=".16" />
            <circle r="3.5" fill="#eefdff" stroke="#2ca7d6" strokeWidth="2" />
            <animateMotion dur="7s" repeatCount="indefinite">
              <mpath href="#cardioid-motion-path" />
            </animateMotion>
          </g>

          <circle className="origin-point" r="3.2" />
        </svg>

        <div className="curve-readout">
          <div>
            <span>FORMULA</span>
            <strong>r = a(1 − sinθ)</strong>
          </div>
          <div>
            <span>FAMILY</span>
            <strong>Cardioid</strong>
          </div>
        </div>

        <span className="curve-scan" />
      </div>

      <div className="particle-field" aria-hidden="true">
        {particles.map(([left, top, size, delay, duration], index) => (
          <i
            key={`${left}-${top}`}
            style={{
              "--particle-left": left,
              "--particle-top": top,
              "--particle-size": size,
              "--particle-delay": delay,
              "--particle-duration": duration,
            }}
          >
            {index % 3 === 0 ? "✦" : ""}
          </i>
        ))}
      </div>

      <span className="curve-note note-a">01 / PARAMETRIC TRACE</span>
      <span className="curve-note note-b">MOVE TO SHIFT THE ORBIT</span>
    </div>
  );
}
