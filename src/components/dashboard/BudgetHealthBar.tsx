import { ProgressBar } from "@/components/ui/ProgressBar";
import { getBudgetHealth } from "@/lib/domain/budget-health";
import { formatCents } from "@/lib/format";

export function BudgetHealthBar({
  limitCents,
  committedCents,
  label = "Budget",
}: {
  limitCents: number;
  committedCents: number;
  label?: string;
}) {
  const health = getBudgetHealth(limitCents, committedCents);
  // Nothing counted against the budget yet (no cost items): an empty bar
  // reads like a measurement, so show the limit on its own instead.
  const hasSpend = committedCents > 0;

  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between font-mono text-xs text-ink-soft">
        <span>{label}</span>
        <span className="tabular-nums">
          {hasSpend
            ? `${formatCents(committedCents)} / ${formatCents(limitCents)}`
            : `${formatCents(limitCents)} · no costs yet`}
        </span>
      </div>
      {hasSpend && <ProgressBar pct={health.pct} level={health.level} />}
    </div>
  );
}
