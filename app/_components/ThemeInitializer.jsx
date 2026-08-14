"use client";

import { useEffect } from "react";

export function ThemeInitializer() {
  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem("zhuo-theme");
      const theme = savedTheme || "light";
      document.documentElement.dataset.theme = theme;
    } catch {
      // Theme preference is optional; the CSS default remains usable.
    }
  }, []);

  return null;
}
