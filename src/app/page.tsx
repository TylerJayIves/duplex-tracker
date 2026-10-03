import { dataClient } from "@/lib/data";
import { AreaSummaryCard } from "@/components/dashboard/AreaSummaryCard";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { KpiStrip } from "@/components/dashboard/KpiStrip";
import { AttentionList } from "@/components/dashboard/AttentionList";
import { UpcomingPanel } from "@/components/dashboard/UpcomingPanel";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ContractorStrip } from "@/components/dashboard/ContractorStrip";
import {
  buildActivityFeed,
  buildUpcomingItems,
  checklistTotals,
  findOverBudgetItems,
  findOverdueTaskItems,
  findQuoteAttentionItems,
  sortAttentionItems,
} from "@/lib/domain/dashboard";
import { formatCents } from "@/lib/format";
import type { Area, ProjectStatus } from "@/lib/data/types";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  idea: "idea",
  planned: "planned",
  in_progress: "in progress",
  done: "done",
  blocked: "blocked",
};

export default async function DashboardPage() {
  const [areas, projects, budgets, contractors, users, dismissedAttentionIds] =
    await Promise.all([
      dataClient.listAreas(),
      dataClient.listProjects(),
      dataClient.listBudgets(),
      dataClient.listContractors(),
      dataClient.listUsers(),
      dataClient.listDismissedAttentionItemIds(),
    ]);
  const dismissedAttentionIdSet = new Set(dismissedAttentionIds);

  const areaById = new Map(areas.map((a) => [a.id, a]));
  const userById = new Map(users.map((u) => [u.id, u]));
  const contractorById = new Map(contractors.map((c) => [c.id, c]));
  const projectById = new Map(projects.map((p) => [p.id, p]));

  // Per-project fan-out: everything the dashboard summarizes lives under a
  // project, so one pass here feeds every KPI/attention/activity
  // computation below instead of re-querying per section.
  const projectBundles = await Promise.all(
    projects.map(async (project) => {
      const [tasks, costItems, quotes, comments, attachments] = await Promise.all([
        dataClient.listTasks(project.id),
        dataClient.listCostItems(project.id),
        dataClient.listQuotes({ projectId: project.id }),
        dataClient.listComments(project.id),
        dataClient.listAttachments("project", project.id),
      ]);
      return { project, tasks, costItems, quotes, comments, attachments };
    })
  );

  const allQuotes = projectBundles.flatMap((b) =>
    b.quotes.map((quote) => ({
      quote,
      projectTitle: b.project.title,
      projectId: b.project.id,
    }))
  );

  // Quote-level attachments (contractor quote PDFs) for the activity feed --
  // a second, shallower fan-out since quotes are nested under projects.
  const quoteAttachmentGroups = await Promise.all(
    allQuotes.map(async ({ quote, projectTitle, projectId }) => ({
      projectTitle,
      projectId,
      attachments: await dataClient.listAttachments("quote", quote.id),
    }))
  );

  const budgetSpends = await Promise.all(
    budgets.map(async (b) => ({ budget: b, spend: await dataClient.getBudgetSpend(b.id) }))
  );

  function budgetForArea(areaId: string) {
    const match = budgetSpends.find(
      (bs) => bs.budget.relatedType === "area" && bs.budget.relatedId === areaId
    );
    if (!match) return null;
    return { limitCents: match.budget.limitCents, committedCents: match.spend.committedCents };
  }

  function checklistForArea(areaId: string) {
    const areaTasks = projectBundles
      .filter((b) => b.project.areaId === areaId)
      .map((b) => b.tasks);
    return checklistTotals(areaTasks);
  }

  const units = areas.filter((a) => a.type === "rental_unit");
  const externalAreas = areas.filter((a) => a.type !== "rental_unit");

  // Finished work sinks to the bottom: done projects go last within each
  // card, and cards whose projects are all done go last within their
  // section. sort() is stable, so everything else keeps its original order.
  function buildAreaCards(areaList: Area[]) {
    return areaList
      .map((area) => {
        const areaProjects = projects
          .filter((p) => p.areaId === area.id)
          .sort((a, b) => Number(a.status === "done") - Number(b.status === "done"));
        return {
          area,
          projects: areaProjects,
          isComplete:
            areaProjects.length > 0 && areaProjects.every((p) => p.status === "done"),
          budget: budgetForArea(area.id),
          checklist: checklistForArea(area.id),
        };
      })
      .sort((a, b) => Number(a.isComplete) - Number(b.isComplete));
  }

  const unitCards = buildAreaCards(units);
  const externalCards = buildAreaCards(externalAreas);

  // ---- KPIs ----
  // "Active" means work that's actually under way. Ideas, planned and
  // blocked projects still show up in the breakdown line below the number.
  const activeProjects = projects.filter((p) => p.status === "in_progress").length;
  const statusCounts = projects.reduce((acc, p) => {
    acc.set(p.status, (acc.get(p.status) ?? 0) + 1);
    return acc;
  }, new Map<ProjectStatus, number>());
  const statusBreakdown =
    [...statusCounts.entries()]
      .map(([status, count]) => `${count} ${STATUS_LABEL[status]}`)
      .join(" · ") || "No projects yet";

  // The spend figure counts every cost item on every project, not just the
  // ones covered by a budget: each cost item belongs to exactly one project,
  // so this can't double-count, and it matches what the project pages add
  // up to. An item counts at its actual cost once that's entered, otherwise
  // at its estimate.
  const allCostItems = projectBundles.flatMap((b) => b.costItems);
  const actualSpentCents = allCostItems.reduce(
    (sum, c) => sum + (c.actualCostCents ?? 0),
    0
  );
  const estimatedOnlyCents = allCostItems.reduce(
    (sum, c) => sum + (c.actualCostCents == null ? c.estimatedCostCents : 0),
    0
  );
  const totalCommittedCents = actualSpentCents + estimatedOnlyCents;

  // The limit side stays scoped to area-level budgets: areas partition
  // projects, so their limits can be summed. Property- and project-level
  // budgets overlap an area budget's scope, so adding their limits would
  // double-count -- they still get their own "Over budget" attention item.
  const areaBudgetSpends = budgetSpends.filter((bs) => bs.budget.relatedType === "area");
  const totalLimitCents = areaBudgetSpends.reduce((sum, bs) => sum + bs.budget.limitCents, 0);

  const { done: checklistDone, total: checklistTotal } = checklistTotals(
    projectBundles.map((b) => b.tasks)
  );

  const quotesAwaiting = allQuotes.filter(
    ({ quote }) => quote.status === "requested" || quote.status === "received"
  );
  const quotesAwaitingDetail =
    quotesAwaiting.length === 0
      ? "All caught up"
      : quotesAwaiting.length === 1
        ? `${contractorById.get(quotesAwaiting[0].quote.contractorId)?.company ?? "A contractor"} · ${formatCents(quotesAwaiting[0].quote.amountCents)}`
        : `Totaling ${formatCents(quotesAwaiting.reduce((sum, q) => sum + q.quote.amountCents, 0))}`;

  // ---- Attention band ----
  // Covers all three budget scopes (area/project/property), not just area --
  // the "Committed spend" KPI already sums across all of them, so the
  // over-budget check needs to match or it'd silently skip project- and
  // property-level budgets that go over.
  const overBudgetInputs = budgetSpends
    .map((bs) => {
      const name =
        bs.budget.relatedType === "area"
          ? areaById.get(bs.budget.relatedId)?.name
          : bs.budget.relatedType === "project"
            ? projectById.get(bs.budget.relatedId)?.title
            : "The property";
      return name
        ? {
            id: bs.budget.id,
            name,
            limitCents: bs.budget.limitCents,
            committedCents: bs.spend.committedCents,
          }
        : null;
    })
    .filter(
      (x): x is { id: string; name: string; limitCents: number; committedCents: number } =>
        x !== null
    );

  const attentionItems = sortAttentionItems([
    ...findOverdueTaskItems(projectBundles),
    ...findOverBudgetItems(overBudgetInputs),
    ...findQuoteAttentionItems(projectBundles, contractorById),
  ]).filter((item) => !dismissedAttentionIdSet.has(item.id));

  // ---- Coming up ----
  const upcomingItems = buildUpcomingItems(areas, projects, areaById).slice(0, 6);

  // ---- Activity feed ----
  const allComments = projectBundles.flatMap((b) =>
    b.comments.map((comment) => ({
      comment,
      projectTitle: b.project.title,
      projectId: b.project.id,
    }))
  );
  const allProjectAttachments = projectBundles.flatMap((b) =>
    b.attachments.map((attachment) => ({
      attachment,
      projectTitle: b.project.title,
      projectId: b.project.id,
    }))
  );
  const allQuoteAttachments = quoteAttachmentGroups.flatMap((g) =>
    g.attachments.map((attachment) => ({
      attachment,
      projectTitle: g.projectTitle,
      projectId: g.projectId,
    }))
  );
  const activityItems = buildActivityFeed(
    allComments,
    [...allProjectAttachments, ...allQuoteAttachments],
    userById
  ).slice(0, 8);

  // ---- Contractors ----
  const contractorSummaries = contractors.map((contractor) => {
    const theirQuotes = allQuotes.filter(({ quote }) => quote.contractorId === contractor.id);
    return {
      contractor,
      quoteCount: theirQuotes.length,
      totalCents: theirQuotes.reduce((sum, { quote }) => sum + quote.amountCents, 0),
    };
  });

  return (
    <div className="space-y-10">
      <div>
        <p className="font-mono text-xs tracking-wide text-primary uppercase">Dashboard</p>
        <h1 className="mt-1 text-3xl font-bold">The 3250 Duplex</h1>
      </div>

      <DashboardOverview>
        <KpiStrip
          activeProjects={activeProjects}
          totalProjects={projects.length}
          statusBreakdown={statusBreakdown}
          committedCents={totalCommittedCents}
          actualSpentCents={actualSpentCents}
          estimatedOnlyCents={estimatedOnlyCents}
          budgetLimitCents={totalLimitCents}
          budgetCount={areaBudgetSpends.length}
          checklistDone={checklistDone}
          checklistTotal={checklistTotal}
          quotesAwaitingCount={quotesAwaiting.length}
          quotesAwaitingDetail={quotesAwaitingDetail}
        />

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Needs attention</h2>
          <AttentionList items={attentionItems} />
        </section>
      </DashboardOverview>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-10">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Units</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {unitCards.map((card) => (
                <AreaSummaryCard key={card.area.id} {...card} />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Shared &amp; external work</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {externalCards.map((card) => (
                <AreaSummaryCard key={card.area.id} {...card} />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <UpcomingPanel items={upcomingItems} />
          <ActivityFeed items={activityItems} />
        </aside>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Your contractors</h2>
        <ContractorStrip contractors={contractorSummaries} />
      </section>
    </div>
  );
}
