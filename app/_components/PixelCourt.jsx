"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function CourtHoop({ court }) {
  const { width, height } = court;
  const rimX = width - 84;
  const rimY = Math.min(115, height * 0.28);
  const boardX = width - 117;
  return <svg className="court-hoop-overlay" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
    <path d={`M ${rimX + 9} ${rimY - 79} H ${rimX + 36} L ${rimX + 14} ${rimY - 53}`} fill="none" stroke="#183f88" strokeWidth="8" />
    <rect x={boardX} y={rimY - 57} width="76" height="52" fill="#dff3ff" stroke="#f7fbff" strokeWidth="5" />
    <rect x={boardX + 22} y={rimY - 41} width="34" height="23" fill="none" stroke="#183f88" strokeWidth="3" />
    <ellipse cx={rimX} cy={rimY} rx="27" ry="8" fill="rgba(247,251,255,.18)" stroke="#ea7029" strokeWidth="4" />
    <g className="court-svg-net" style={{ transformOrigin: `${rimX}px ${rimY}px` }} fill="none" stroke="rgba(247,251,255,.96)" strokeWidth="3">
      <path d={`M ${rimX - 24} ${rimY + 5} L ${rimX - 17} ${rimY + 36} H ${rimX + 17} L ${rimX + 24} ${rimY + 5}`} />
      <path d={`M ${rimX - 19} ${rimY + 7} L ${rimX - 9} ${rimY + 35} M ${rimX - 10} ${rimY + 6} L ${rimX} ${rimY + 36} M ${rimX} ${rimY + 6} L ${rimX + 10} ${rimY + 35} M ${rimX + 10} ${rimY + 7} L ${rimX} ${rimY + 36} M ${rimX + 19} ${rimY + 7} L ${rimX + 9} ${rimY + 35}`} />
    </g>
  </svg>;
}

function ThreePointLine({ court }) {
  const { width, height } = court;
  const rimY = Math.min(115, height * 0.28);
  const sideX = width - 42;
  const topY = Math.max(52, rimY - 34);
  const baselineY = height - 78;
  const radius = (baselineY - topY) / 2;
  return <svg className="court-three-overlay" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
    <path d={`M ${sideX} ${topY} A ${radius} ${radius} 0 0 0 ${sideX} ${baselineY}`} />
  </svg>;
}

function ShotOverlay({ made, shotKey, court, playerPosition }) {
  const { width, height } = court;
  const rimX = width - 84;
  const rimY = Math.min(115, height * 0.28);
  const playerX = width * (playerPosition.x / 100) + Math.min(32, width * 0.065);
  const playerY = height * (playerPosition.y / 100) - Math.min(28, height * 0.07);
  const peakY = Math.max(28, rimY - Math.min(200, height * 0.42));
  const path = made
    ? `M ${playerX} ${playerY} Q ${(playerX + rimX) / 2} ${peakY} ${rimX} ${rimY} L ${rimX} ${rimY + 36}`
    : `M ${playerX} ${playerY} Q ${(playerX + rimX) / 2} ${peakY} ${rimX + 7} ${rimY + 2} Q ${rimX + 42} ${rimY + 32} ${rimX + 52} ${rimY + 76}`;
  return <svg className="court-shot-overlay" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
    <g key={shotKey}>
      <circle cx="0" cy="0" r="11" fill="#f47a20" stroke="#8e3b18" strokeWidth="3" />
      <path d="M -8 -5 Q 0 0 -8 5 M 8 -5 Q 0 0 8 5 M -9 2 H 9" fill="none" stroke="#8e3b18" strokeWidth="1.8" />
      <animateMotion path={path} dur="1.18s" fill="freeze" />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.05;0.87;1" dur="1.18s" fill="freeze" />
    </g>
  </svg>;
}

export function PixelCourt() {
  const stageRef = useRef(null);
  const surfaceRef = useRef(null);
  const playerRef = useRef(null);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [shooting, setShooting] = useState(false);
  const [result, setResult] = useState("ready");
  const [score, setScore] = useState({ made: 0, attempts: 0 });
  const [court, setCourt] = useState({ width: 500, height: 420 });
  const [playerPosition, setPlayerPosition] = useState({ x: 25, y: 76 });
  const playerPositionRef = useRef(playerPosition);
  const [shotPosition, setShotPosition] = useState(playerPosition);
  const [dragging, setDragging] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setCourt({ width: Math.round(width), height: Math.round(height) });
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const shoot = (position = playerPositionRef.current) => {
    if (shooting) return;
    const made = Math.random() < 0.69;
    setResult(made ? "score" : "miss");
    setScore((current) => ({ made: current.made + (made ? 1 : 0), attempts: current.attempts + 1 }));
    setShotPosition(position);
    setShooting(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setShooting(false), 1180);
  };

  const updatePlayerPosition = (clientX, clientY) => {
    const stage = stageRef.current;
    const surface = surfaceRef.current;
    const player = playerRef.current;
    if (!stage || !surface || !player) return playerPositionRef.current;

    const stageRect = stage.getBoundingClientRect();
    const surfaceRect = surface.getBoundingClientRect();
    const halfWidth = Math.min(player.offsetWidth * 0.4, surfaceRect.width * 0.12);
    const halfHeight = Math.min(player.offsetHeight * 0.42, surfaceRect.height * 0.17);
    const x = Math.min(surfaceRect.right - halfWidth, Math.max(surfaceRect.left + halfWidth, clientX));
    const y = Math.min(surfaceRect.bottom - halfHeight, Math.max(surfaceRect.top + halfHeight, clientY));
    const position = {
      x: ((x - stageRect.left) / stageRect.width) * 100,
      y: ((y - stageRect.top) / stageRect.height) * 100,
    };

    playerPositionRef.current = position;
    player.style.setProperty("--player-x", position.x);
    player.style.setProperty("--player-y", position.y);
    return position;
  };

  const handlePlayerPointerDown = (event) => {
    if (shooting || event.button > 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, clientX: event.clientX, clientY: event.clientY, moved: false };
  };

  const handlePlayerPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (Math.hypot(event.clientX - drag.clientX, event.clientY - drag.clientY) > 8) {
      event.preventDefault();
      drag.moved = true;
      setDragging(true);
      updatePlayerPosition(event.clientX, event.clientY);
    }
  };

  const handlePlayerPointerEnd = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture?.(event.pointerId);
    suppressClickRef.current = true;
    const position = playerPositionRef.current;
    if (drag.moved) setPlayerPosition(position);
    else shoot(position);
    window.setTimeout(() => { suppressClickRef.current = false; }, 0);
  };

  const handlePlayerClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    shoot(playerPositionRef.current);
  };

  const cancelDrag = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const status = result === "score" ? "命中！" : result === "miss" ? "差一点" : "准备投篮";

  return <div ref={stageRef} className={`pixel-court-stage ${shooting ? "is-shooting" : ""} ${shooting ? `is-${result}` : ""}`} aria-label="像素投篮练习场">
    <span ref={surfaceRef} className="court-surface" aria-hidden="true" />
    <div className="court-label"><span>SHOOTING LAB</span><b>拖动站位 · 点击投篮</b></div>
    <ThreePointLine court={court} />
    <div className="court-score" aria-live="polite">
      <div className="court-score-lights" aria-hidden="true"><i /><i /><i /></div>
      <small>投篮记分牌</small>
      <strong><b>{score.made}</b><em>/</em><b>{score.attempts}</b></strong>
      <span>{status}</span>
    </div>
    <CourtHoop court={court} />
    {shooting ? <ShotOverlay made={result === "score"} shotKey={score.attempts} court={court} playerPosition={shotPosition} /> : null}
    <button ref={playerRef} type="button" className={`court-player${dragging ? " is-dragging" : ""}`} style={{ "--player-x": playerPositionRef.current.x, "--player-y": playerPositionRef.current.y }} onPointerDown={handlePlayerPointerDown} onPointerMove={handlePlayerPointerMove} onPointerUp={handlePlayerPointerEnd} onPointerCancel={cancelDrag} onLostPointerCapture={cancelDrag} onClick={handlePlayerClick} onDragStart={(event) => event.preventDefault()} aria-label="拖动 Zhuo 调整投篮站位，点击投篮" title="拖动调整站位，点击投篮">
      <Image src="/zhuo-pixel-player.png" alt="" width={512} height={512} priority draggable={false} />
    </button>
    <span className="court-floor" aria-hidden="true" />
  </div>;
}