import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { BudgetHealthBar } from "@/components/dashboard/BudgetHealthBar";
import { formatDate } from "@/lib/format";
import type { Area, Project } from "@/lib/data/types";

export function ProjectCard({
  project,
  area,
  budget,
}: {
  project: Project;
  area: Area | undefined;
  budget: { limitCents: number; committedCents: number } | null;
}) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="flex h-full flex-col gap-3 transition-colors hover:border-primary">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
              {area?.name ?? "—"}
            </p>
            <h3 className="font-heading text-lg font-semibold">
              {project.title}
            </h3>
          </div>
          <StatusPill status={project.status} />
        </div>
        <p className="line-clamp-2 text-sm text-ink-soft">
          {project.description}
        </p>
        <p className="mt-auto text-xs text-ink-soft">
          Target: {formatDate(project.targetEndDate)}
        </p>
        {budget && (
          <BudgetHealthBar
            limitCents={budget.limitCents}
            committedCents={budget.committedCents}
            label="Project budget"
          />
        )}
      </Card>
    </Link>
  );
}
