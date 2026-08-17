import type {
  Area,
  Attachment,
  AttachmentRelatedType,
  Budget,
  BudgetRelatedType,
  Comment,
  Contractor,
  CostItem,
  ID,
  Project,
  ProjectStatus,
  Property,
  Quote,
  QuoteReminder,
  Task,
  User,
} from "./types";

export interface DataClient {
  getProperty(): Promise<Property>;
  listAreas(): Promise<Area[]>;
  getArea(id: ID): Promise<Area | null>;
  updateArea(
    id: ID,
    patch: Partial<Pick<Area, "targetRentCents" | "targetReadyDate">>
  ): Promise<Area>;

  listProjects(filter?: {
    areaId?: ID;
    status?: ProjectStatus;
  }): Promise<Project[]>;
  getProject(id: ID): Promise<Project | null>;
  createProject(
    input: Pick<Project, "areaId" | "leadId" | "title" | "category"> &
      Partial<
        Pick<
          Project,
          "description" | "priority" | "startDate" | "targetEndDate" | "color"
        >
      >
  ): Promise<Project>;
  updateProject(
    id: ID,
    patch: Partial<
      Pick<
        Project,
        | "title"
        | "description"
        | "priority"
        | "startDate"
        | "targetEndDate"
        | "leadId"
        | "color"
      >
    >
  ): Promise<Project>;
  updateProjectStatus(id: ID, status: ProjectStatus): Promise<Project>;
  deleteProject(id: ID): Promise<void>;

  listTasks(projectId: ID): Promise<Task[]>;
  createTask(
    input: Pick<Task, "projectId" | "title" | "order"> & Partial<Pick<Task, "dueDate">>
  ): Promise<Task>;
  updateTask(
    id: ID,
    patch: Partial<Pick<Task, "isDone" | "title" | "dueDate" | "order">>
  ): Promise<Task>;
  deleteTask(id: ID): Promise<void>;

  listCostItems(projectId: ID): Promise<CostItem[]>;
  createCostItem(
    input: Pick<CostItem, "projectId" | "label" | "category" | "estimatedCostCents">
  ): Promise<CostItem>;
  updateCostItem(
    id: ID,
    patch: Partial<
      Pick<
        CostItem,
        "label" | "category" | "estimatedCostCents" | "actualCostCents" | "paidDate"
      >
    >
  ): Promise<CostItem>;
  deleteCostItem(id: ID): Promise<void>;

  listContractors(): Promise<Contractor[]>;
  getContractor(id: ID): Promise<Contractor | null>;
  createContractor(
    input: Pick<Contractor, "name" | "trade"> &
      Partial<Pick<Contractor, "company" | "phone" | "email" | "notes" | "rating">>
  ): Promise<Contractor>;
  updateContractor(
    id: ID,
    patch: Partial<
      Pick<Contractor, "name" | "company" | "phone" | "email" | "trade" | "notes" | "rating">
    >
  ): Promise<Contractor>;
  deleteContractor(id: ID): Promise<void>;

  listQuotes(filter: { projectId?: ID; contractorId?: ID }): Promise<Quote[]>;
  createQuote(
    input: Pick<Quote, "projectId" | "contractorId" | "amountCents" | "scopeDescription"> &
      Partial<Pick<Quote, "status" | "receivedDate" | "validUntil">>
  ): Promise<Quote>;
  updateQuote(
    id: ID,
    patch: Partial<
      Pick<Quote, "amountCents" | "scopeDescription" | "status" | "receivedDate" | "validUntil">
    >
  ): Promise<Quote>;
  deleteQuote(id: ID): Promise<void>;

  listBudgets(filter?: {
    relatedType?: BudgetRelatedType;
    relatedId?: ID;
  }): Promise<Budget[]>;
  getBudgetSpend(
    budgetId: ID
  ): Promise<{ budget: Budget; spentCents: number; committedCents: number }>;
  createBudget(
    input: Pick<Budget, "relatedType" | "relatedId" | "limitCents"> &
      Partial<Pick<Budget, "notes">>
  ): Promise<Budget>;
  updateBudget(
    id: ID,
    patch: Partial<Pick<Budget, "limitCents" | "notes">>
  ): Promise<Budget>;

  listUpcomingQuoteReminders(
    withinDays: number
  ): Promise<Array<QuoteReminder & { quote: Quote }>>;

  /** Deterministic dashboard "needs attention" item ids Tyler/Elle have dismissed, e.g. "task-<uuid>". */
  listDismissedAttentionItemIds(): Promise<string[]>;
  dismissAttentionItem(itemId: string, dismissedById: ID): Promise<void>;

  listComments(projectId: ID): Promise<Comment[]>;
  getComment(id: ID): Promise<Comment | null>;
  addComment(input: {
    projectId: ID;
    authorId: ID;
    text: string;
  }): Promise<Comment>;
  deleteComment(id: ID): Promise<void>;

  listAttachments(
    relatedType: AttachmentRelatedType,
    relatedId: ID
  ): Promise<Attachment[]>;
  addAttachment(input: {
    relatedType: AttachmentRelatedType;
    relatedId: ID;
    fileUrl: string;
    caption: string | null;
    uploadedById: ID;
  }): Promise<Attachment>;
  /** Resolves a stored fileUrl (a storage path) to something actually viewable, or null if the underlying file is missing. */
  getAttachmentUrl(fileUrl: string): Promise<string | null>;
  deleteAttachment(id: ID): Promise<void>;

  listUsers(): Promise<User[]>;
  getUser(id: ID): Promise<User | null>;
}
