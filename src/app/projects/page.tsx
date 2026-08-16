import { dataClient } from "@/lib/data";
import { FilterBar } from "@/components/projects/FilterBar";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { AddProjectDisclosure } from "@/components/projects/AddProjectDisclosure";
import type { ProjectStatus } from "@/lib/data/types";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; status?: string }>;
}) {
  const params = await searchParams;
  const areaId = params.area || undefined;
  const status = (params.status as ProjectStatus | undefined) || undefined;

  const [areas, projects, budgets, users] = await Promise.all([
    dataClient.listAreas(),
    dataClient.listProjects({ areaId, status }),
    dataClient.listBudgets({ relatedType: "project" }),
    dataClient.listUsers(),
  ]);

  const budgetSpends = await Promise.all(
    budgets.map(async (b) => ({
      budget: b,
      spend: await dataClient.getBudgetSpend(b.id),
    }))
  );

  const areaById = new Map(areas.map((a) => [a.id, a]));

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs tracking-wide text-primary uppercase">
          Projects
        </p>
        <h1 className="mt-1 text-3xl font-bold">All Projects</h1>
      </div>

      <FilterBar areas={areas} />

      {projects.length === 0 ? (
        <p className="text-sm text-ink-soft">No projects match these filters.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const match = budgetSpends.find(
              (bs) => bs.budget.relatedId === project.id
            );
            return (
              <ProjectCard
                key={project.id}
                project={project}
                area={areaById.get(project.areaId)}
                budget={
                  match
                    ? {
                        limitCents: match.budget.limitCents,
                        committedCents: match.spend.committedCents,
                      }
                    : null
                }
              />
            );
          })}
        </div>
      )}

      <AddProjectDisclosure areas={areas} users={users} />
    </div>
  );
}
