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

  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between font-mono text-xs text-ink-soft">
        <span>{label}</span>
        <span className="tabular-nums">
          {formatCents(committedCents)} / {formatCents(limitCents)}
        </span>
      </div>
      <ProgressBar pct={health.pct} level={health.level} />
    </div>
  );
}
