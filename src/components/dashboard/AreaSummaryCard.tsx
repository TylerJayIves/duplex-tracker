"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { BudgetHealthBar } from "./BudgetHealthBar";
import { EditAreaForm } from "./EditAreaForm";
import { formatCents, formatDate } from "@/lib/format";
import { projectColorConfig } from "@/lib/project-colors";
import { cn } from "@/lib/utils";
import type { Area, Project } from "@/lib/data/types";

export function AreaSummaryCard({
  area,
  projects,
  isComplete,
  budget,
  checklist,
}: {
  area: Area;
  projects: Project[];
  /** Every project in this area is done; the card is shown muted. */
  isComplete: boolean;
  budget: { limitCents: number; committedCents: number } | null;
  checklist: { done: number; total: number } | null;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const rentCents = area.targetRentCents;
  const hasRent = rentCents != null && rentCents > 0;

  return (
    <Card className={cn("flex flex-col gap-4", isComplete && "opacity-70")}>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-heading text-xl font-semibold">{area.name}</h3>
          {isComplete && (
            <span className="bg-moss-soft px-1.5 py-0.5 font-mono text-[0.64rem] tracking-wide text-moss uppercase">
              ✓ Complete
            </span>
          )}
        </div>
        {area.type === "rental_unit" &&
          (isEditing ? (
            <div className="mt-2">
              <EditAreaForm area={area} onDone={() => setIsEditing(false)} />
            </div>
          ) : (
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
              <span
                className={
                  hasRent
                    ? "bg-moss-soft px-1.5 py-0.5 font-mono text-[0.64rem] tracking-wide text-moss uppercase"
                    : "bg-amber-soft px-1.5 py-0.5 font-mono text-[0.64rem] tracking-wide text-amber uppercase"
                }
              >
                {hasRent ? "On track" : "Rent TBD"}
              </span>
              <span>
                {hasRent && <>{formatCents(rentCents)}/mo &middot; </>}
                ready {formatDate(area.targetReadyDate)}
              </span>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase hover:text-primary"
              >
                Edit
              </button>
            </div>
          ))}
      </div>

      {checklist && checklist.total > 0 && (
        <div className="space-y-1">
          <div className="flex items-baseline justify-between font-mono text-xs text-ink-soft">
            <span>Checklist</span>
            <span className="tabular-nums">
              {checklist.done} / {checklist.total}
            </span>
          </div>
          <ProgressBar pct={(checklist.done / checklist.total) * 100} level="good" />
        </div>
      )}

      {projects.length > 0 ? (
        <ul className="space-y-2">
          {projects.map((project) => {
            const color = projectColorConfig(project.color);
            const isDone = project.status === "done";
            return (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.id}`}
                  className="flex items-center justify-between gap-2 text-sm hover:text-primary"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {color && (
                      <span
                        className={cn("h-2 w-2 shrink-0 rounded-full", color.dot)}
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={cn(
                        "min-w-0 truncate",
                        isDone && "text-ink-soft line-through"
                      )}
                    >
                      {project.title}
                    </span>
                  </span>
                  <StatusPill status={project.status} />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-ink-soft">No projects yet.</p>
      )}

      {budget && (
        <BudgetHealthBar
          limitCents={budget.limitCents}
          committedCents={budget.committedCents}
        />
      )}
    </Card>
  );
}
