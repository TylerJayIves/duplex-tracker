import { cn } from "@/lib/utils";
import type { BudgetHealthLevel } from "@/lib/domain/budget-health";

const LEVEL_CLASSES: Record<BudgetHealthLevel, string> = {
  good: "bg-moss",
  attention: "bg-amber",
  critical: "bg-brick",
};

export function ProgressBar({
  pct,
  level,
  className,
}: {
  pct: number;
  level: BudgetHealthLevel;
  className?: string;
}) {
  const clamped = Math.min(100, Math.max(0, pct));
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden bg-paper-raised", className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full", LEVEL_CLASSES[level])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
