import { daysUntil, formatCents, formatDate } from "@/lib/format";
import { getBudgetHealth } from "./budget-health";
import type {
  Area,
  Attachment,
  Comment,
  Contractor,
  Project,
  Quote,
  Task,
  User,
} from "@/lib/data/types";

export interface AttentionItem {
  id: string;
  tone: "brick" | "amber";
  tag: string;
  title: string;
  meta: string;
  projectId?: string;
  /** Lower sorts first within the same tone -- days-until-due for real deadlines. */
  urgency: number;
}

export function findOverdueTaskItems(
  bundles: Array<{ project: Project; tasks: Task[] }>
): AttentionItem[] {
  const items: AttentionItem[] = [];
  for (const { project, tasks } of bundles) {
    for (const task of tasks) {
      if (task.isDone || !task.dueDate) continue;
      const days = daysUntil(task.dueDate);
      if (days >= 0) continue;
      const overdueBy = Math.abs(days);
      items.push({
        id: `task-${task.id}`,
        tone: "brick",
        tag: "Overdue",
        title: `"${task.title}" is ${overdueBy} day${overdueBy === 1 ? "" : "s"} overdue`,
        meta: `${project.title} · due ${formatDate(task.dueDate)}`,
        projectId: project.id,
        urgency: days,
      });
    }
  }
  return items;
}

export function findOverBudgetItems(
  budgetInputs: Array<{
    id: string;
    name: string;
    limitCents: number;
    committedCents: number;
  }>
): AttentionItem[] {
  return budgetInputs
    .filter(
      ({ limitCents, committedCents }) =>
        getBudgetHealth(limitCents, committedCents).level === "critical"
    )
    .map(({ id, name, limitCents, committedCents }) => ({
      id: `budget-${id}`,
      tone: "brick" as const,
      tag: "Over budget",
      title: `${name} is over budget`,
      meta: `${formatCents(committedCents)} committed against a ${formatCents(limitCents)} limit`,
      urgency: limitCents - committedCents,
    }));
}

export function findQuoteAttentionItems(
  bundles: Array<{ project: Project; quotes: Quote[] }>,
  contractorById: Map<string, Contractor>
): AttentionItem[] {
  const items: AttentionItem[] = [];
  for (const { project, quotes } of bundles) {
    for (const quote of quotes) {
      if (quote.status !== "requested" && quote.status !== "received") continue;
      const company = contractorById.get(quote.contractorId)?.company ?? "A contractor";

      if (quote.validUntil) {
        const days = daysUntil(quote.validUntil);
        if (days <= 14) {
          items.push({
            id: `quote-${quote.id}`,
            tone: days <= 3 ? "brick" : "amber",
            tag: days < 0 ? "Expired" : "Expires soon",
            title:
              days < 0
                ? `${company}'s quote has expired`
                : `${company}'s quote expires in ${days} day${days === 1 ? "" : "s"}`,
            meta: `${project.title} · ${formatCents(quote.amountCents)} · valid until ${formatDate(quote.validUntil)}`,
            projectId: project.id,
            urgency: days,
          });
          continue;
        }
      }

      items.push({
        id: `quote-${quote.id}`,
        tone: "amber",
        tag: "Awaiting you",
        title: `${company}'s quote needs a decision`,
        meta: `${project.title} · ${formatCents(quote.amountCents)}`,
        projectId: project.id,
        urgency: 1000,
      });
    }
  }
  return items;
}

export function sortAttentionItems(items: AttentionItem[]): AttentionItem[] {
  return [...items].sort((a, b) => {
    if (a.tone !== b.tone) return a.tone === "brick" ? -1 : 1;
    return a.urgency - b.urgency;
  });
}

export interface UpcomingItem {
  id: string;
  date: string;
  what: string;
  where: string;
}

export function buildUpcomingItems(
  areas: Area[],
  projects: Project[],
  areaById: Map<string, Area>
): UpcomingItem[] {
  const items: UpcomingItem[] = [];

  for (const area of areas) {
    if (
      area.type === "rental_unit" &&
      area.targetReadyDate &&
      daysUntil(area.targetReadyDate) >= 0
    ) {
      items.push({
        id: `area-${area.id}`,
        date: area.targetReadyDate,
        what: `${area.name} ready for rent`,
        where: `Unit ${area.name}`,
      });
    }
  }

  for (const project of projects) {
    if (project.status === "done" || !project.targetEndDate) continue;
    if (daysUntil(project.targetEndDate) < 0) continue;
    items.push({
      id: `project-${project.id}`,
      date: project.targetEndDate,
      what: `${project.title} target`,
      where: areaById.get(project.areaId)?.name ?? "",
    });
  }

  return items.sort((a, b) => a.date.localeCompare(b.date));
}

export interface ActivityItem {
  id: string;
  kind: "comment" | "attachment";
  authorName: string;
  projectTitle: string;
  projectId: string;
  when: string;
  text?: string;
  filename?: string;
}

export function buildActivityFeed(
  comments: Array<{ comment: Comment; projectTitle: string; projectId: string }>,
  attachments: Array<{ attachment: Attachment; projectTitle: string; projectId: string }>,
  userById: Map<string, User>
): ActivityItem[] {
  const items: ActivityItem[] = [];

  for (const { comment, projectTitle, projectId } of comments) {
    items.push({
      id: `comment-${comment.id}`,
      kind: "comment",
      authorName: userById.get(comment.authorId)?.name ?? "Unknown",
      projectTitle,
      projectId,
      when: comment.createdAt,
      text: comment.text,
    });
  }

  for (const { attachment, projectTitle, projectId } of attachments) {
    items.push({
      id: `attachment-${attachment.id}`,
      kind: "attachment",
      authorName: userById.get(attachment.uploadedById)?.name ?? "Unknown",
      projectTitle,
      projectId,
      when: attachment.uploadedAt,
      filename: attachment.caption || attachment.fileUrl.split("/").pop() || "file",
    });
  }

  return items.sort((a, b) => b.when.localeCompare(a.when));
}

export function checklistTotals(tasksLists: Task[][]): {
  done: number;
  total: number;
} {
  const all = tasksLists.flat();
  return { done: all.filter((t) => t.isDone).length, total: all.length };
}
