"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Client-mount flag to avoid rendering theme-dependent output before hydration —
  // there's no external state to synchronize with here, just a one-time mount signal.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Avoid rendering theme-dependent output before we know the resolved theme.
    return <div className="h-7 w-16" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="border border-border px-2 py-1 font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase hover:text-ink"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? "Dark" : "Light"}
    </button>
  );
}
