import { daysUntil } from "@/lib/format";
import type { DataClient } from "../client";
import type {
  Attachment,
  Budget,
  Comment,
  Contractor,
  CostItem,
  ID,
  Project,
  Quote,
  Task,
} from "../types";
import * as seed from "./seed";

/**
 * In-memory store, module-level so it survives across requests within one
 * dev server process. Resets on server restart / Fast Refresh of this file —
 * that's expected for mock data, not a bug to work around.
 */
const store = {
  property: seed.property,
  areas: [...seed.areas],
  projects: [...seed.projects],
  tasks: [...seed.tasks],
  costItems: [...seed.costItems],
  contractors: [...seed.contractors],
  quotes: [...seed.quotes],
  quoteReminders: [...seed.quoteReminders],
  budgets: [...seed.budgets],
  comments: [...seed.comments],
  attachments: [...seed.attachments],
  users: [...seed.users],
  dismissedAttentionItemIds: new Set<string>(),
};

let nextCommentId = store.comments.length + 1;
let nextAttachmentId = store.attachments.length + 1;
let nextProjectId = store.projects.length + 1;
let nextCostItemId = store.costItems.length + 1;
let nextContractorId = store.contractors.length + 1;
let nextQuoteId = store.quotes.length + 1;
let nextTaskId = store.tasks.length + 1;
let nextBudgetId = store.budgets.length + 1;

function withinDays(dateStr: string | null, days: number): boolean {
  if (!dateStr) return false;
  const daysOut = daysUntil(dateStr);
  return daysOut >= 0 && daysOut <= days;
}

export const mockClient: DataClient = {
  async getProperty() {
    return store.property;
  },

  async listAreas() {
    return [...store.areas];
  },

  async getArea(id) {
    return store.areas.find((a) => a.id === id) ?? null;
  },

  async updateArea(id, patch) {
    const area = store.areas.find((a) => a.id === id);
    if (!area) throw new Error(`Area not found: ${id}`);
    Object.assign(area, patch);
    return area;
  },

  async listProjects(filter) {
    return store.projects.filter(
      (p) =>
        (!filter?.areaId || p.areaId === filter.areaId) &&
        (!filter?.status || p.status === filter.status)
    );
  },

  async getProject(id) {
    return store.projects.find((p) => p.id === id) ?? null;
  },

  async createProject(input) {
    const project: Project = {
      id: `project-${nextProjectId++}`,
      areaId: input.areaId,
      leadId: input.leadId,
      title: input.title,
      description: input.description ?? "",
      category: input.category,
      status: "idea",
      priority: input.priority ?? "medium",
      startDate: input.startDate ?? null,
      targetEndDate: input.targetEndDate ?? null,
      color: input.color ?? null,
    };
    store.projects.push(project);
    return project;
  },

  async updateProject(id, patch) {
    const project = store.projects.find((p) => p.id === id);
    if (!project) throw new Error(`Project not found: ${id}`);
    Object.assign(project, patch);
    return project;
  },

  async updateProjectStatus(id, status) {
    const project = store.projects.find((p) => p.id === id);
    if (!project) throw new Error(`Project not found: ${id}`);
    project.status = status;
    return project;
  },

  async deleteProject(id) {
    const quoteIds = store.quotes
      .filter((q) => q.projectId === id)
      .map((q) => q.id);
    const costItemIds = store.costItems
      .filter((c) => c.projectId === id)
      .map((c) => c.id);

    // Mirror the real client's cleanup so mock behavior doesn't drift:
    // remove everything a project owns, including attachments/reminders
    // that point at its quotes and cost items (no real FK for those).
    store.attachments = store.attachments.filter(
      (a) =>
        !(
          (a.relatedType === "project" && a.relatedId === id) ||
          (a.relatedType === "quote" && quoteIds.includes(a.relatedId)) ||
          (a.relatedType === "cost_item" && costItemIds.includes(a.relatedId))
        )
    );
    store.quoteReminders = store.quoteReminders.filter(
      (r) => !quoteIds.includes(r.quoteId)
    );
    store.budgets = store.budgets.filter(
      (b) => !(b.relatedType === "project" && b.relatedId === id)
    );
    store.comments = store.comments.filter((c) => c.projectId !== id);
    store.tasks = store.tasks.filter((t) => t.projectId !== id);
    store.costItems = store.costItems.filter((c) => c.projectId !== id);
    store.quotes = store.quotes.filter((q) => q.projectId !== id);

    const index = store.projects.findIndex((p) => p.id === id);
    if (index !== -1) store.projects.splice(index, 1);
  },

  async listTasks(projectId) {
    return store.tasks
      .filter((t) => t.projectId === projectId)
      .sort((a, b) => a.order - b.order);
  },

  async createTask(input) {
    const task: Task = {
      id: `task-${nextTaskId++}`,
      projectId: input.projectId,
      assignedToId: null,
      title: input.title,
      isDone: false,
      order: input.order,
      dueDate: input.dueDate ?? null,
    };
    store.tasks.push(task);
    return task;
  },

  async updateTask(id, patch) {
    const task = store.tasks.find((t) => t.id === id);
    if (!task) throw new Error(`Task not found: ${id}`);
    Object.assign(task, patch satisfies Partial<Task>);
    return task;
  },

  async deleteTask(id) {
    const index = store.tasks.findIndex((t) => t.id === id);
    if (index !== -1) store.tasks.splice(index, 1);
  },

  async listCostItems(projectId) {
    return store.costItems.filter((c) => c.projectId === projectId);
  },

  async createCostItem(input) {
    const costItem: CostItem = {
      id: `cost-${nextCostItemId++}`,
      projectId: input.projectId,
      label: input.label,
      category: input.category,
      estimatedCostCents: input.estimatedCostCents,
      actualCostCents: null,
      paidDate: null,
    };
    store.costItems.push(costItem);
    return costItem;
  },

  async updateCostItem(id, patch) {
    const costItem = store.costItems.find((c) => c.id === id);
    if (!costItem) throw new Error(`Cost item not found: ${id}`);
    Object.assign(costItem, patch);
    return costItem;
  },

  async deleteCostItem(id) {
    const index = store.costItems.findIndex((c) => c.id === id);
    if (index !== -1) store.costItems.splice(index, 1);
  },

  async listContractors() {
    return [...store.contractors];
  },

  async getContractor(id) {
    return store.contractors.find((c) => c.id === id) ?? null;
  },

  async createContractor(input) {
    const contractor: Contractor = {
      id: `contractor-${nextContractorId++}`,
      name: input.name,
      company: input.company ?? "",
      phone: input.phone ?? "",
      email: input.email ?? "",
      trade: input.trade,
      notes: input.notes ?? "",
      rating: input.rating ?? null,
    };
    store.contractors.push(contractor);
    return contractor;
  },

  async updateContractor(id, patch) {
    const contractor = store.contractors.find((c) => c.id === id);
    if (!contractor) throw new Error(`Contractor not found: ${id}`);
    Object.assign(contractor, patch);
    return contractor;
  },

  async deleteContractor(id) {
    const stillQuoted = store.quotes.some((q) => q.contractorId === id);
    if (stillQuoted) {
      throw new Error("This contractor has quotes on file — remove those first.");
    }
    const index = store.contractors.findIndex((c) => c.id === id);
    if (index !== -1) store.contractors.splice(index, 1);
  },

  async listQuotes(filter) {
    return store.quotes.filter(
      (q) =>
        (!filter.projectId || q.projectId === filter.projectId) &&
        (!filter.contractorId || q.contractorId === filter.contractorId)
    );
  },

  async createQuote(input) {
    const quote: Quote = {
      id: `quote-${nextQuoteId++}`,
      projectId: input.projectId,
      contractorId: input.contractorId,
      amountCents: input.amountCents,
      scopeDescription: input.scopeDescription,
      status: input.status ?? "requested",
      receivedDate: input.receivedDate ?? null,
      validUntil: input.validUntil ?? null,
    };
    store.quotes.push(quote);
    return quote;
  },

  async updateQuote(id, patch) {
    const quote = store.quotes.find((q) => q.id === id);
    if (!quote) throw new Error(`Quote not found: ${id}`);
    Object.assign(quote, patch);
    return quote;
  },

  async deleteQuote(id) {
    const index = store.quotes.findIndex((q) => q.id === id);
    if (index !== -1) store.quotes.splice(index, 1);
    // Mirror the real client's cleanup so mock behavior doesn't drift:
    // remove any attachments/reminders that pointed at this quote.
    store.attachments = store.attachments.filter(
      (a) => !(a.relatedType === "quote" && a.relatedId === id)
    );
    store.quoteReminders = store.quoteReminders.filter((r) => r.quoteId !== id);
  },

  async listBudgets(filter) {
    return store.budgets.filter(
      (b) =>
        (!filter?.relatedType || b.relatedType === filter.relatedType) &&
        (!filter?.relatedId || b.relatedId === filter.relatedId)
    );
  },

  async getBudgetSpend(budgetId) {
    const budget = store.budgets.find((b) => b.id === budgetId);
    if (!budget) throw new Error(`Budget not found: ${budgetId}`);

    const projectIds =
      budget.relatedType === "project"
        ? [budget.relatedId]
        : budget.relatedType === "area"
          ? store.projects
              .filter((p) => p.areaId === budget.relatedId)
              .map((p) => p.id)
          : store.projects.map((p) => p.id); // property-level: everything

    const relevantCostItems = store.costItems.filter((c) =>
      projectIds.includes(c.projectId)
    );

    const spentCents = relevantCostItems.reduce(
      (sum, c) => sum + (c.actualCostCents ?? 0),
      0
    );
    const committedCents =
      spentCents +
      relevantCostItems.reduce(
        (sum, c) => sum + (c.actualCostCents == null ? c.estimatedCostCents : 0),
        0
      );

    return { budget, spentCents, committedCents };
  },

  async createBudget(input) {
    const budget: Budget = {
      id: `budget-${nextBudgetId++}`,
      relatedType: input.relatedType,
      relatedId: input.relatedId,
      limitCents: input.limitCents,
      notes: input.notes ?? "",
    };
    store.budgets.push(budget);
    return budget;
  },

  async updateBudget(id, patch) {
    const budget = store.budgets.find((b) => b.id === id);
    if (!budget) throw new Error(`Budget not found: ${id}`);
    Object.assign(budget, patch);
    return budget;
  },

  async listUpcomingQuoteReminders(withinDaysArg) {
    // A reminder is "upcoming" once it's fired (sentAt) and not yet dismissed,
    // and its quote's own deadline still falls inside the requested window —
    // sentAt marks when the nudge went out, not when the quote expires.
    return store.quoteReminders
      .filter((r) => r.sentAt && !r.dismissedAt)
      .map((r) => {
        const quote = store.quotes.find((q) => q.id === r.quoteId);
        if (!quote) throw new Error(`Quote not found for reminder: ${r.id}`);
        return { ...r, quote };
      })
      .filter((r) => r.quote.validUntil && withinDays(r.quote.validUntil, withinDaysArg));
  },

  async listDismissedAttentionItemIds() {
    return [...store.dismissedAttentionItemIds];
  },

  async dismissAttentionItem(itemId) {
    store.dismissedAttentionItemIds.add(itemId);
  },

  async listComments(projectId) {
    return store.comments
      .filter((c) => c.projectId === projectId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },

  async getComment(id) {
    return store.comments.find((c) => c.id === id) ?? null;
  },

  async addComment(input) {
    const comment: Comment = {
      id: `comment-${nextCommentId++}`,
      projectId: input.projectId,
      authorId: input.authorId,
      text: input.text,
      createdAt: new Date().toISOString(),
    };
    store.comments.push(comment);
    return comment;
  },

  async deleteComment(id) {
    const index = store.comments.findIndex((c) => c.id === id);
    if (index !== -1) store.comments.splice(index, 1);
  },

  async listAttachments(relatedType, relatedId) {
    return store.attachments.filter(
      (a) => a.relatedType === relatedType && a.relatedId === relatedId
    );
  },

  async addAttachment(input) {
    const attachment: Attachment = {
      id: `attachment-${nextAttachmentId++}`,
      relatedType: input.relatedType,
      relatedId: input.relatedId,
      fileUrl: input.fileUrl,
      caption: input.caption,
      uploadedById: input.uploadedById,
      uploadedAt: new Date().toISOString(),
    };
    store.attachments.push(attachment);
    return attachment;
  },

  async getAttachmentUrl(fileUrl) {
    return fileUrl;
  },

  async deleteAttachment(id) {
    const index = store.attachments.findIndex((a) => a.id === id);
    if (index !== -1) store.attachments.splice(index, 1);
  },

  async listUsers() {
    return [...store.users];
  },

  async getUser(id: ID) {
    return store.users.find((u) => u.id === id) ?? null;
  },
};
