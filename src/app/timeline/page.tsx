import Link from "next/link";
import { dataClient } from "@/lib/data";
import { StatusPill } from "@/components/ui/StatusPill";
import { formatDate } from "@/lib/format";

export default async function TimelinePage() {
  const [projects, areas] = await Promise.all([
    dataClient.listProjects(),
    dataClient.listAreas(),
  ]);

  const areaById = new Map(areas.map((a) => [a.id, a]));

  const dated = projects
    .filter((p) => p.startDate)
    .sort((a, b) => (a.startDate ?? "").localeCompare(b.startDate ?? ""));
  const undated = projects.filter((p) => !p.startDate);

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs tracking-wide text-primary uppercase">
          Timeline
        </p>
        <h1 className="mt-1 text-3xl font-bold">Timeline</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          A simple chronological read for now — a real calendar/Gantt view is
          coming later.
        </p>
      </div>

      <ul className="divide-y divide-border border-t border-b border-border">
        {dated.map((project) => (
          <li
            key={project.id}
            className="flex flex-wrap items-center justify-between gap-2 py-3"
          >
            <div>
              <Link
                href={`/projects/${project.id}`}
                className="font-medium hover:text-primary"
              >
                {project.title}
              </Link>
              <p className="font-mono text-xs text-ink-soft">
                {areaById.get(project.areaId)?.name ?? "—"} &middot;{" "}
                {formatDate(project.startDate)} &rarr;{" "}
                {formatDate(project.targetEndDate)}
              </p>
            </div>
            <StatusPill status={project.status} />
          </li>
        ))}
      </ul>

      {undated.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-ink-soft">
            Not yet scheduled
          </h2>
          <ul className="space-y-1">
            {undated.map((project) => (
              <li
                key={project.id}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <Link
                  href={`/projects/${project.id}`}
                  className="hover:text-primary"
                >
                  {project.title}
                </Link>
                <StatusPill status={project.status} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
