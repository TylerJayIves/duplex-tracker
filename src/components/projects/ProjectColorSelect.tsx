"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PROJECT_COLORS } from "@/lib/project-colors";
import type { ProjectColor } from "@/lib/data/types";

export function ProjectColorSelect({
  defaultValue,
}: {
  defaultValue?: ProjectColor | null;
}) {
  const [selected, setSelected] = useState<ProjectColor | null>(defaultValue ?? null);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="color" value={selected ?? ""} />
      <button
        type="button"
        onClick={() => setSelected(null)}
        aria-label="No color"
        aria-pressed={selected === null}
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full border-2 border-dashed border-ink-soft text-[0.6rem] text-ink-soft",
          selected === null && "ring-2 ring-ring ring-offset-2 ring-offset-background"
        )}
      >
        ×
      </button>
      {PROJECT_COLORS.map((c) => (
        <button
          key={c.value}
          type="button"
          onClick={() => setSelected(c.value)}
          aria-label={c.label}
          aria-pressed={selected === c.value}
          title={c.label}
          className={cn(
            "h-6 w-6 rounded-full",
            c.swatch,
            selected === c.value && "ring-2 ring-ring ring-offset-2 ring-offset-background"
          )}
        />
      ))}
    </div>
  );
}
