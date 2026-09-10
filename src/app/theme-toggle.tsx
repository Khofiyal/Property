"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  function toggle() {
    // If currently dark (or system evaluating to dark), switch to light, else dark
    const isCurrentlyDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    const next = isCurrentlyDark ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] opacity-50" />
    );
  }

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light/dark theme"
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--gold)] transition-transform duration-300 hover:scale-105 active:scale-95"
    >
      {isDark ? (
        <Sun className="h-4 w-4 stroke-[1.8]" />
      ) : (
        <Moon className="h-4 w-4 stroke-[1.8]" />
      )}
    </button>
  );
}
