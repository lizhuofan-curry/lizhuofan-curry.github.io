"use client";
import { useEffect } from "react";
export function ThemeInitializer() {
  useEffect(() => {
    const keyboard = () => { document.documentElement.dataset.input = "keyboard"; try { sessionStorage.setItem("zhuo-input", "keyboard"); } catch {} };
    const pointer = () => { document.documentElement.dataset.input = "pointer"; try { sessionStorage.setItem("zhuo-input", "pointer"); } catch {} };
    document.addEventListener("keydown", keyboard);
    document.addEventListener("pointerdown", pointer, { passive: true });
    return () => { document.removeEventListener("keydown", keyboard); document.removeEventListener("pointerdown", pointer); };
  }, []);
  return null;
}
