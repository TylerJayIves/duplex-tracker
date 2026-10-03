"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function FunThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Same mount guard as the classic ThemeToggle: the resolved theme is only
  // known on the client.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="size-9" aria-hidden />;

  const isDark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="fun-wiggle grid size-9 place-content-center rounded-full border-2 border-ink bg-card text-lg shadow-[2px_2px_0_var(--fun-shadow)]"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span aria-hidden>{isDark ? "🌙" : "☀️"}</span>
    </button>
  );
}
