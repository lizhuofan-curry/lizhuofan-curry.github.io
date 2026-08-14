"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export function PixelPlayer({ className = "", compact = false }) {
  const [celebrating, setCelebrating] = useState(false);
  const timerRef = useRef(null);

  const play = () => {
    window.clearTimeout(timerRef.current);
    setCelebrating(false);
    requestAnimationFrame(() => {
      setCelebrating(true);
      timerRef.current = window.setTimeout(() => setCelebrating(false), 680);
    });
  };

  return <button type="button" className={`pixel-player ${compact ? "pixel-player-compact" : ""} ${celebrating ? "is-dribbling" : ""} ${className}`} onClick={play} aria-label="让 Zhuo 的像素角色运球" title="点一下角色">
    <Image src="/zhuo-pixel-player.png" alt="" width={512} height={512} priority />
    <span className="pixel-player-ball" aria-hidden="true" />
    <span className="pixel-player-spark pixel-player-spark-one" aria-hidden="true" />
    <span className="pixel-player-spark pixel-player-spark-two" aria-hidden="true" />
  </button>;
}
