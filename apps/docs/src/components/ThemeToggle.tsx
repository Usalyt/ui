"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

/**
 * Read the active theme from storage first, then the document attribute.
 * Only called in the browser (mount effect / click handler).
 */
function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  const stored =
    window.localStorage.getItem("starlight-theme") ?? window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

/**
 * Sun/Moon theme toggle.
 *
 * Writes both localStorage keys the site reads (`starlight-theme` for Starlight
 * and `theme` for legacy consumers), sets `documentElement.dataset.theme` and
 * keeps the Tailwind `.dark` class in sync. Renders a stable label until mounted
 * so SSR and the first client render match.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const toggleTheme = () => {
    const next: Theme = (theme ?? readTheme()) === "dark" ? "light" : "dark";
    setTheme(next);

    const root = document.documentElement;
    root.dataset.theme = next;
    root.classList.toggle("dark", next === "dark");

    try {
      window.localStorage.setItem("starlight-theme", next);
      window.localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable (private mode) — the dataset above still applies */
    }
  };

  const isDark = theme !== "light";
  const label =
    theme === null
      ? "Toggle color theme"
      : isDark
        ? "Switch to light mode"
        : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      data-theme-toggle=""
      className="theme-toggle-btn"
    >
      {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
}
