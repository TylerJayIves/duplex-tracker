import { notFound } from "next/navigation";
import { dataClient } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { ProjectHeader } from "@/components/project-detail/ProjectHeader";
import { TaskChecklist } from "@/components/project-detail/TaskChecklist";
import { CostItemsTable } from "@/components/project-detail/CostItemsTable";
import { QuoteComparisonTable } from "@/components/project-detail/QuoteComparisonTable";
import { CommentsThread } from "@/components/project-detail/CommentsThread";
import { AttachmentsList } from "@/components/project-detail/AttachmentsList";
import { ProjectBudgetCard } from "@/components/project-detail/ProjectBudgetCard";
import { getCurrentUser } from "@/lib/auth/current-user";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await dataClient.getProject(projectId);
  if (!project) notFound();

  const [area, lead, tasks, costItems, quotes, contractors, budgets, comments, users] =
    await Promise.all([
      dataClient.getArea(project.areaId),
      dataClient.getUser(project.leadId),
      dataClient.listTasks(project.id),
      dataClient.listCostItems(project.id),
      dataClient.listQuotes({ projectId: project.id }),
      dataClient.listContractors(),
      dataClient.listBudgets({ relatedType: "project", relatedId: project.id }),
      dataClient.listComments(project.id),
      dataClient.listUsers(),
    ]);

  const projectBudget = budgets[0];
  const budgetSpend = projectBudget
    ? await dataClient.getBudgetSpend(projectBudget.id)
    : null;

  // Middleware already guarantees a session exists by the time this renders.
  const currentUser = (await getCurrentUser())!;
  const currentUserId = currentUser.id;

  return (
    <div className="space-y-10">
      <ProjectHeader project={project} area={area} lead={lead} users={users} />

      <ProjectBudgetCard
        projectId={project.id}
        budget={
          projectBudget
            ? {
                id: projectBudget.id,
                limitCents: projectBudget.limitCents,
                notes: projectBudget.notes,
              }
            : null
        }
        committedCents={budgetSpend?.committedCents ?? 0}
        canEdit={currentUser.name === "Tyler"}
      />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Checklist</h2>
        <Card>
          <TaskChecklist projectId={project.id} tasks={tasks} />
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Cost items</h2>
        <Card>
          <CostItemsTable costItems={costItems} projectId={project.id} />
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Quotes</h2>
        <QuoteComparisonTable
          quotes={quotes}
          contractors={contractors}
          projectId={project.id}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Comments</h2>
        <Card>
          <CommentsThread
            projectId={project.id}
            comments={comments}
            users={users}
            currentUserId={currentUserId}
          />
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Attachments</h2>
        <Card>
          <AttachmentsList
            relatedType="project"
            relatedId={project.id}
            projectId={project.id}
          />
        </Card>
      </section>
    </div>
  );
}
