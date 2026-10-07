import { useCallback, useLayoutEffect, useState } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "portfolio-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    // Theme persistence is optional; a storage restriction should not break page startup.
  }

  const mediaQuery = typeof window.matchMedia === "function" ? window.matchMedia("(prefers-color-scheme: light)") : null;
  return mediaQuery?.matches ? "light" : "dark";
}

/**
 * This is a UI preference (light/dark), not sensitive data — persisting it
 * in localStorage is fine and is explicitly the documented exception in
 * this project's rules against browser storage inside sandboxed artifacts;
 * this is a real deployed app, not a Claude artifact.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, theme);
      } catch {
        // Keep the in-memory theme even when browser storage is unavailable.
      }
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#f4f3ef" : "#0c1115");
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return { theme, setTheme, toggleTheme };
}
