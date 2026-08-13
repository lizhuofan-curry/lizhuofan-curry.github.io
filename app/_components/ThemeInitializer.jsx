"use client";

import { useEffect } from "react";

export function ThemeInitializer() {
  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem("zhuo-theme");
      const theme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.dataset.theme = theme;
    } catch {
      // Theme preference is optional; the CSS default remains usable.
    }
  }, []);

  return null;
}
