"use client";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
export function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  useEffect(() => { setTheme(document.documentElement.dataset.theme || "light"); }, []);
  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("zhuo-theme", next); } catch { /* optional preference */ }
    setTheme(next);
  }
  return <button className="icon-button" type="button" onClick={toggle} aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}><Icon name={theme === "dark" ? "sun" : "moon"}/></button>;
}
