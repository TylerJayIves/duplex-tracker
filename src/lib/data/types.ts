export type ID = string;

/** ISO 8601 date or datetime string — never a Date object, to stay serializable across the server/client boundary and match what supabase-js returns. */
export type ISODateString = string;

export interface Property {
  id: ID;
  address: string;
  notes: string;
}

export type AreaType = "rental_unit" | "external" | "shared";

export interface Area {
  id: ID;
  propertyId: ID;
  name: string;
  type: AreaType;
  /** cents; only meaningful when type === 'rental_unit' */
  targetRentCents: number | null;
  targetReadyDate: ISODateString | null;
  /** 0-100; only meaningful when type === 'rental_unit'; splits shared/external costs */
  sharedAllocationPct: number | null;
}

export type ProjectStatus =
  | "idea"
  | "planned"
  | "in_progress"
  | "done"
  | "blocked";

export type ProjectPriority = "low" | "medium" | "high";

export interface Project {
  id: ID;
  areaId: ID;
  leadId: ID;
  title: string;
  description: string;
  category: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: ISODateString | null;
  targetEndDate: ISODateString | null;
}

export interface Task {
  id: ID;
  projectId: ID;
  assignedToId: ID | null;
  title: string;
  isDone: boolean;
  order: number;
  dueDate: ISODateString | null;
}

export type CostCategory = "materials" | "labor" | "permits" | "other";

export interface CostItem {
  id: ID;
  projectId: ID;
  label: string;
  category: CostCategory;
  estimatedCostCents: number;
  actualCostCents: number | null;
  paidDate: ISODateString | null;
}

export interface Contractor {
  id: ID;
  name: string;
  company: string;
  phone: string;
  email: string;
  trade: string;
  notes: string;
  rating: number | null;
}

export type QuoteStatus = "requested" | "received" | "accepted" | "declined";

export interface Quote {
  id: ID;
  projectId: ID;
  contractorId: ID;
  amountCents: number;
  scopeDescription: string;
  status: QuoteStatus;
  receivedDate: ISODateString | null;
  validUntil: ISODateString | null;
}

export interface QuoteReminder {
  id: ID;
  quoteId: ID;
  offsetDays: 14 | 7 | 3;
  sentAt: ISODateString | null;
  dismissedAt: ISODateString | null;
}

export type BudgetRelatedType = "property" | "area" | "project";

export interface Budget {
  id: ID;
  relatedType: BudgetRelatedType;
  relatedId: ID;
  limitCents: number;
  notes: string;
}

export interface BudgetOverride {
  id: ID;
  budgetId: ID;
  triggeringAction: "quote_accepted" | "cost_item_added";
  amountOverCents: number;
  acknowledgedById: ID;
  acknowledgedAt: ISODateString;
  note: string | null;
}

export interface ExpenseExport {
  id: ID;
  areaId: ID | null;
  year: number;
  generatedById: ID;
  generatedAt: ISODateString;
  totalCents: number;
  fileUrl: string;
}

export interface User {
  id: ID;
  name: string;
  email: string;
}

export interface Comment {
  id: ID;
  projectId: ID;
  authorId: ID;
  text: string;
  createdAt: ISODateString;
}

export type AttachmentRelatedType = "project" | "quote" | "cost_item";

export interface Attachment {
  id: ID;
  relatedType: AttachmentRelatedType;
  relatedId: ID;
  fileUrl: string;
  caption: string | null;
  uploadedById: ID;
  uploadedAt: ISODateString;
}
