"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const saved = localStorage.getItem("zhuo-theme");
    const next = saved || "light";
    document.documentElement.dataset.theme = next;
    setTheme(next);
  }, []);
  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("zhuo-theme", next);
    setTheme(next);
  }
  return <button className="icon-button theme-toggle" type="button" onClick={toggle} aria-label={theme === "dark" ? "切换到浅色模式" : "切换到深色模式"}>{theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}</button>;
}
