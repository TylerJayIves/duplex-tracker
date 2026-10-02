import { ProgressBar } from "@/components/ui/ProgressBar";
import { getBudgetHealth } from "@/lib/domain/budget-health";
import { formatCents } from "@/lib/format";

export function KpiStrip({
  activeProjects,
  totalProjects,
  statusBreakdown,
  committedCents,
  actualSpentCents,
  estimatedOnlyCents,
  budgetLimitCents,
  budgetCount,
  checklistDone,
  checklistTotal,
  quotesAwaitingCount,
  quotesAwaitingDetail,
}: {
  activeProjects: number;
  totalProjects: number;
  statusBreakdown: string;
  committedCents: number;
  actualSpentCents: number;
  estimatedOnlyCents: number;
  budgetLimitCents: number;
  budgetCount: number;
  checklistDone: number;
  checklistTotal: number;
  quotesAwaitingCount: number;
  quotesAwaitingDetail: string;
}) {
  const budgetHealth = getBudgetHealth(budgetLimitCents, committedCents);
  const checklistPct =
    checklistTotal === 0 ? 0 : Math.round((checklistDone / checklistTotal) * 100);

  return (
    <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
      <div className="flex flex-col gap-2 bg-card p-4">
        <p className="font-mono text-[0.68rem] tracking-wide text-primary uppercase">
          Active projects
        </p>
        <p className="font-heading text-3xl tabular-nums">
          {activeProjects}{" "}
          <span className="font-sans text-base text-ink-soft">of {totalProjects}</span>
        </p>
        <p className="text-xs text-ink-soft">{statusBreakdown}</p>
      </div>

      <div className="flex flex-col gap-2 bg-card p-4">
        <p className="font-mono text-[0.68rem] tracking-wide text-primary uppercase">
          Committed spend
        </p>
        <p className="font-heading text-3xl tabular-nums">
          {formatCents(committedCents)}{" "}
          <span className="font-sans text-base text-ink-soft">
            / {formatCents(budgetLimitCents)}
          </span>
        </p>
        <ProgressBar pct={budgetHealth.pct} level={budgetHealth.level} />
        <p className="text-xs text-ink-soft">
          {formatCents(actualSpentCents)} actual · {formatCents(estimatedOnlyCents)} estimated
        </p>
        <p className="text-xs text-ink-soft">
          Limit from {budgetCount} area budget{budgetCount === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex flex-col gap-2 bg-card p-4">
        <p className="font-mono text-[0.68rem] tracking-wide text-primary uppercase">
          Checklist progress
        </p>
        <div className="flex items-center gap-3">
          <ChecklistDonut pct={checklistPct} />
          <div>
            <p className="font-heading text-2xl tabular-nums">{checklistPct}%</p>
            <p className="text-xs text-ink-soft">
              {checklistDone} of {checklistTotal} items done
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 bg-card p-4">
        <p className="font-mono text-[0.68rem] tracking-wide text-primary uppercase">
          Quotes awaiting decision
        </p>
        <p className="font-heading text-3xl tabular-nums">{quotesAwaitingCount}</p>
        <p className="text-xs text-ink-soft">{quotesAwaitingDetail}</p>
      </div>
    </div>
  );
}

function ChecklistDonut({ pct }: { pct: number }) {
  return (
    <div
      className="relative h-12 w-12 shrink-0 rounded-full"
      style={{
        background: `conic-gradient(var(--primary) ${pct}%, var(--paper-raised) ${pct}% 100%)`,
      }}
    >
      <div className="absolute inset-[4px] rounded-full bg-card" />
    </div>
  );
}
