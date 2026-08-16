import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { daysUntil } from "@/lib/format";
import type { DataClient } from "../client";
import type {
  Area,
  Attachment,
  AttachmentRelatedType,
  Budget,
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
} from "../types";
import type { Database } from "./database.types";

/** Per-request, same reasoning as lib/supabase/server.ts -- not a module-level singleton. */
async function client() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll() {
          // Data-layer reads/writes never run in a context that needs to
          // refresh the session cookie -- middleware already did that.
        },
      },
    }
  );
}

type Row<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

/**
 * Attachments are polymorphic (no FK to project/quote/cost_item), so any
 * delete of a row they can point at must clean these up explicitly first --
 * a bare delete orphans Storage files, the same issue the seed data had
 * before the "file unavailable" fix. Shared by deleteQuote and deleteProject.
 */
async function cleanupAttachments(
  supabase: Awaited<ReturnType<typeof client>>,
  relatedType: AttachmentRelatedType,
  relatedIds: ID[]
) {
  if (relatedIds.length === 0) return;
  const { data } = await supabase
    .from("attachments")
    .select("file_url")
    .eq("related_type", relatedType)
    .in("related_id", relatedIds);
  if (!data || data.length === 0) return;
  await supabase.storage.from("attachments").remove(data.map((a) => a.file_url));
  await supabase
    .from("attachments")
    .delete()
    .eq("related_type", relatedType)
    .in("related_id", relatedIds);
}

function mapProperty(row: Row<"properties">): Property {
  return { id: row.id, address: row.address, notes: row.notes ?? "" };
}

function mapArea(row: Row<"areas">): Area {
  return {
    id: row.id,
    propertyId: row.property_id,
    name: row.name,
    type: row.type,
    targetRentCents: row.target_rent_cents,
    targetReadyDate: row.target_ready_date,
    sharedAllocationPct: row.shared_allocation_pct,
  };
}

function mapProject(row: Row<"projects">): Project {
  return {
    id: row.id,
    areaId: row.area_id,
    leadId: row.lead_id,
    title: row.title,
    description: row.description ?? "",
    category: row.category ?? "",
    status: row.status,
    priority: row.priority,
    startDate: row.start_date,
    targetEndDate: row.target_end_date,
  };
}

function mapTask(row: Row<"tasks">): Task {
  return {
    id: row.id,
    projectId: row.project_id,
    assignedToId: row.assigned_to_id,
    title: row.title,
    isDone: row.is_done,
    order: row.order,
    dueDate: row.due_date,
  };
}

function mapCostItem(row: Row<"cost_items">): CostItem {
  return {
    id: row.id,
    projectId: row.project_id,
    label: row.label,
    category: row.category,
    estimatedCostCents: row.estimated_cost_cents,
    actualCostCents: row.actual_cost_cents,
    paidDate: row.paid_date,
  };
}

function mapContractor(row: Row<"contractors">): Contractor {
  return {
    id: row.id,
    name: row.name,
    company: row.company ?? "",
    phone: row.phone ?? "",
    email: row.email ?? "",
    trade: row.trade ?? "",
    notes: row.notes ?? "",
    rating: row.rating,
  };
}

function mapQuote(row: Row<"quotes">): Quote {
  return {
    id: row.id,
    projectId: row.project_id,
    contractorId: row.contractor_id,
    amountCents: row.amount_cents,
    scopeDescription: row.scope_description ?? "",
    status: row.status,
    receivedDate: row.received_date,
    validUntil: row.valid_until,
  };
}

function mapQuoteReminder(row: Row<"quote_reminders">): QuoteReminder {
  return {
    id: row.id,
    quoteId: row.quote_id,
    offsetDays: row.offset_days as QuoteReminder["offsetDays"],
    sentAt: row.sent_at,
    dismissedAt: row.dismissed_at,
  };
}

function mapBudget(row: Row<"budgets">): Budget {
  return {
    id: row.id,
    relatedType: row.related_type,
    relatedId: row.related_id,
    limitCents: row.limit_cents,
    notes: row.notes ?? "",
  };
}

function mapComment(row: Row<"comments">): Comment {
  return {
    id: row.id,
    projectId: row.project_id,
    authorId: row.author_id,
    text: row.text,
    createdAt: row.created_at,
  };
}

function mapAttachment(row: Row<"attachments">): Attachment {
  return {
    id: row.id,
    relatedType: row.related_type,
    relatedId: row.related_id,
    fileUrl: row.file_url,
    caption: row.caption,
    uploadedById: row.uploaded_by_id,
    uploadedAt: row.uploaded_at,
  };
}

function mapUser(row: Row<"users">): User {
  return { id: row.id, name: row.name, email: row.email };
}

/** Cost items for whatever project set a budget's scope resolves to. */
async function costItemsForBudget(
  supabase: Awaited<ReturnType<typeof client>>,
  budget: Row<"budgets">
): Promise<Row<"cost_items">[]> {
  let projectIds: string[];

  if (budget.related_type === "project") {
    projectIds = [budget.related_id];
  } else if (budget.related_type === "area") {
    const { data } = await supabase
      .from("projects")
      .select("id")
      .eq("area_id", budget.related_id);
    projectIds = (data ?? []).map((p) => p.id);
  } else {
    const { data: areas } = await supabase
      .from("areas")
      .select("id")
      .eq("property_id", budget.related_id);
    const areaIds = (areas ?? []).map((a) => a.id);
    const { data: projects } = await supabase
      .from("projects")
      .select("id")
      .in("area_id", areaIds.length ? areaIds : ["00000000-0000-0000-0000-000000000000"]);
    projectIds = (projects ?? []).map((p) => p.id);
  }

  if (projectIds.length === 0) return [];

  const { data, error } = await supabase
    .from("cost_items")
    .select("*")
    .in("project_id", projectIds);
  if (error) throw error;
  return data ?? [];
}

export const supabaseClient: DataClient = {
  async getProperty() {
    const supabase = await client();
    const { data, error } = await supabase.from("properties").select("*").single();
    if (error) throw error;
    return mapProperty(data);
  },

  async listAreas() {
    const supabase = await client();
    const { data, error } = await supabase.from("areas").select("*");
    if (error) throw error;
    return (data ?? []).map(mapArea);
  },

  async getArea(id) {
    const supabase = await client();
    const { data } = await supabase.from("areas").select("*").eq("id", id).maybeSingle();
    return data ? mapArea(data) : null;
  },

  async updateArea(id, patch) {
    const supabase = await client();
    const dbPatch: Database["public"]["Tables"]["areas"]["Update"] = {};
    if (patch.targetRentCents !== undefined) dbPatch.target_rent_cents = patch.targetRentCents;
    if (patch.targetReadyDate !== undefined) dbPatch.target_ready_date = patch.targetReadyDate;

    const { data, error } = await supabase
      .from("areas")
      .update(dbPatch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return mapArea(data);
  },

  async listProjects(filter) {
    const supabase = await client();
    let query = supabase.from("projects").select("*");
    if (filter?.areaId) query = query.eq("area_id", filter.areaId);
    if (filter?.status) query = query.eq("status", filter.status);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(mapProject);
  },

  async getProject(id) {
    const supabase = await client();
    const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
    return data ? mapProject(data) : null;
  },

  async createProject(input) {
    const supabase = await client();
    const { data, error } = await supabase
      .from("projects")
      .insert({
        area_id: input.areaId,
        lead_id: input.leadId,
        title: input.title,
        category: input.category,
        description: input.description ?? null,
        priority: input.priority ?? "medium",
        start_date: input.startDate ?? null,
        target_end_date: input.targetEndDate ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return mapProject(data);
  },

  async updateProject(id, patch) {
    const supabase = await client();
    const dbPatch: Database["public"]["Tables"]["projects"]["Update"] = {};
    if (patch.title !== undefined) dbPatch.title = patch.title;
    if (patch.description !== undefined) dbPatch.description = patch.description;
    if (patch.priority !== undefined) dbPatch.priority = patch.priority;
    if (patch.startDate !== undefined) dbPatch.start_date = patch.startDate;
    if (patch.targetEndDate !== undefined) dbPatch.target_end_date = patch.targetEndDate;
    if (patch.leadId !== undefined) dbPatch.lead_id = patch.leadId;

    const { data, error } = await supabase
      .from("projects")
      .update(dbPatch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return mapProject(data);
  },

  async updateProjectStatus(id, status: ProjectStatus) {
    const supabase = await client();
    const { data, error } = await supabase
      .from("projects")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return mapProject(data);
  },

  async deleteProject(id) {
    const supabase = await client();

    const [{ data: quoteRows }, { data: costItemRows }] = await Promise.all([
      supabase.from("quotes").select("id").eq("project_id", id),
      supabase.from("cost_items").select("id").eq("project_id", id),
    ]);

    await Promise.all([
      cleanupAttachments(supabase, "project", [id]),
      cleanupAttachments(supabase, "quote", (quoteRows ?? []).map((q) => q.id)),
      cleanupAttachments(
        supabase,
        "cost_item",
        (costItemRows ?? []).map((c) => c.id)
      ),
    ]);

    // Budgets are polymorphic too (no FK) -- clean up any budget scoped
    // directly to this project; area/property-level budgets are untouched.
    await supabase
      .from("budgets")
      .delete()
      .eq("related_type", "project")
      .eq("related_id", id);

    // tasks/cost_items/quotes/quote_reminders/comments all cascade
    // automatically (on delete cascade in the schema).
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
  },

  async listTasks(projectId) {
    const supabase = await client();
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", projectId)
      .order("order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapTask);
  },

  async createTask(input) {
    const supabase = await client();
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        project_id: input.projectId,
        title: input.title,
        order: input.order,
        due_date: input.dueDate ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return mapTask(data);
  },

  async updateTask(id, patch) {
    const supabase = await client();
    const dbPatch: Database["public"]["Tables"]["tasks"]["Update"] = {};
    if (patch.isDone !== undefined) dbPatch.is_done = patch.isDone;
    if (patch.title !== undefined) dbPatch.title = patch.title;
    if (patch.dueDate !== undefined) dbPatch.due_date = patch.dueDate;
    if (patch.order !== undefined) dbPatch.order = patch.order;

    const { data, error } = await supabase
      .from("tasks")
      .update(dbPatch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return mapTask(data);
  },

  async deleteTask(id) {
    const supabase = await client();
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;
  },

  async listCostItems(projectId) {
    const supabase = await client();
    const { data, error } = await supabase
      .from("cost_items")
      .select("*")
      .eq("project_id", projectId);
    if (error) throw error;
    return (data ?? []).map(mapCostItem);
  },

  async createCostItem(input) {
    const supabase = await client();
    const { data, error } = await supabase
      .from("cost_items")
      .insert({
        project_id: input.projectId,
        label: input.label,
        category: input.category,
        estimated_cost_cents: input.estimatedCostCents,
      })
      .select()
      .single();
    if (error) throw error;
    return mapCostItem(data);
  },

  async updateCostItem(id, patch) {
    const supabase = await client();
    const dbPatch: Database["public"]["Tables"]["cost_items"]["Update"] = {};
    if (patch.label !== undefined) dbPatch.label = patch.label;
    if (patch.category !== undefined) dbPatch.category = patch.category;
    if (patch.estimatedCostCents !== undefined)
      dbPatch.estimated_cost_cents = patch.estimatedCostCents;
    if (patch.actualCostCents !== undefined) dbPatch.actual_cost_cents = patch.actualCostCents;
    if (patch.paidDate !== undefined) dbPatch.paid_date = patch.paidDate;

    const { data, error } = await supabase
      .from("cost_items")
      .update(dbPatch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return mapCostItem(data);
  },

  async deleteCostItem(id) {
    const supabase = await client();
    const { error } = await supabase.from("cost_items").delete().eq("id", id);
    if (error) throw error;
  },

  async listContractors() {
    const supabase = await client();
    const { data, error } = await supabase.from("contractors").select("*");
    if (error) throw error;
    return (data ?? []).map(mapContractor);
  },

  async getContractor(id) {
    const supabase = await client();
    const { data } = await supabase.from("contractors").select("*").eq("id", id).maybeSingle();
    return data ? mapContractor(data) : null;
  },

  async createContractor(input) {
    const supabase = await client();
    const { data, error } = await supabase
      .from("contractors")
      .insert({
        name: input.name,
        trade: input.trade,
        company: input.company ?? null,
        phone: input.phone ?? null,
        email: input.email ?? null,
        notes: input.notes ?? null,
        rating: input.rating ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return mapContractor(data);
  },

  async updateContractor(id, patch) {
    const supabase = await client();
    const dbPatch: Database["public"]["Tables"]["contractors"]["Update"] = {};
    if (patch.name !== undefined) dbPatch.name = patch.name;
    if (patch.company !== undefined) dbPatch.company = patch.company;
    if (patch.phone !== undefined) dbPatch.phone = patch.phone;
    if (patch.email !== undefined) dbPatch.email = patch.email;
    if (patch.trade !== undefined) dbPatch.trade = patch.trade;
    if (patch.notes !== undefined) dbPatch.notes = patch.notes;
    if (patch.rating !== undefined) dbPatch.rating = patch.rating;

    const { data, error } = await supabase
      .from("contractors")
      .update(dbPatch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return mapContractor(data);
  },

  async deleteContractor(id) {
    const supabase = await client();
    const { error } = await supabase.from("contractors").delete().eq("id", id);
    if (error) {
      if (error.code === "23503") {
        throw new Error("This contractor has quotes on file — remove those first.");
      }
      throw error;
    }
  },

  async listQuotes(filter) {
    const supabase = await client();
    let query = supabase.from("quotes").select("*");
    if (filter.projectId) query = query.eq("project_id", filter.projectId);
    if (filter.contractorId) query = query.eq("contractor_id", filter.contractorId);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(mapQuote);
  },

  async createQuote(input) {
    const supabase = await client();
    const { data, error } = await supabase
      .from("quotes")
      .insert({
        project_id: input.projectId,
        contractor_id: input.contractorId,
        amount_cents: input.amountCents,
        scope_description: input.scopeDescription,
        status: input.status ?? "requested",
        received_date: input.receivedDate ?? null,
        valid_until: input.validUntil ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return mapQuote(data);
  },

  async updateQuote(id, patch) {
    const supabase = await client();
    const dbPatch: Database["public"]["Tables"]["quotes"]["Update"] = {};
    if (patch.amountCents !== undefined) dbPatch.amount_cents = patch.amountCents;
    if (patch.scopeDescription !== undefined)
      dbPatch.scope_description = patch.scopeDescription;
    if (patch.status !== undefined) dbPatch.status = patch.status;
    if (patch.receivedDate !== undefined) dbPatch.received_date = patch.receivedDate;
    if (patch.validUntil !== undefined) dbPatch.valid_until = patch.validUntil;

    const { data, error } = await supabase
      .from("quotes")
      .update(dbPatch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return mapQuote(data);
  },

  async deleteQuote(id) {
    const supabase = await client();
    await cleanupAttachments(supabase, "quote", [id]);
    // quote_reminders cascades automatically (on delete cascade in the schema).
    const { error } = await supabase.from("quotes").delete().eq("id", id);
    if (error) throw error;
  },

  async listBudgets(filter) {
    const supabase = await client();
    let query = supabase.from("budgets").select("*");
    if (filter?.relatedType) query = query.eq("related_type", filter.relatedType);
    if (filter?.relatedId) query = query.eq("related_id", filter.relatedId);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(mapBudget);
  },

  async createBudget(input) {
    const supabase = await client();
    const { data, error } = await supabase
      .from("budgets")
      .insert({
        related_type: input.relatedType,
        related_id: input.relatedId,
        limit_cents: input.limitCents,
        notes: input.notes ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return mapBudget(data);
  },

  async updateBudget(id, patch) {
    const supabase = await client();
    const dbPatch: Database["public"]["Tables"]["budgets"]["Update"] = {};
    if (patch.limitCents !== undefined) dbPatch.limit_cents = patch.limitCents;
    if (patch.notes !== undefined) dbPatch.notes = patch.notes;

    const { data, error } = await supabase
      .from("budgets")
      .update(dbPatch)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return mapBudget(data);
  },

  async getBudgetSpend(budgetId) {
    const supabase = await client();
    const { data: budgetRow, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("id", budgetId)
      .single();
    if (error) throw error;

    const costItems = await costItemsForBudget(supabase, budgetRow);
    const spentCents = costItems.reduce((sum, c) => sum + (c.actual_cost_cents ?? 0), 0);
    const committedCents =
      spentCents +
      costItems.reduce(
        (sum, c) => sum + (c.actual_cost_cents == null ? c.estimated_cost_cents : 0),
        0
      );

    return { budget: mapBudget(budgetRow), spentCents, committedCents };
  },

  async listUpcomingQuoteReminders(withinDays) {
    const supabase = await client();
    const { data, error } = await supabase
      .from("quote_reminders")
      .select("*, quote:quotes(*)")
      .not("sent_at", "is", null)
      .is("dismissed_at", null);
    if (error) throw error;

    return (data ?? [])
      .filter((row) => {
        if (!row.quote?.valid_until) return false;
        const days = daysUntil(row.quote.valid_until);
        return days >= 0 && days <= withinDays;
      })
      .map((row) => ({
        ...mapQuoteReminder(row),
        quote: mapQuote(row.quote!),
      }));
  },

  async listDismissedAttentionItemIds() {
    const supabase = await client();
    const { data, error } = await supabase.from("attention_dismissals").select("item_id");
    if (error) throw error;
    return (data ?? []).map((row) => row.item_id);
  },

  async dismissAttentionItem(itemId, dismissedById) {
    const supabase = await client();
    const { error } = await supabase
      .from("attention_dismissals")
      .upsert(
        { item_id: itemId, dismissed_by_id: dismissedById },
        { onConflict: "item_id" }
      );
    if (error) throw error;
  },

  async listComments(projectId) {
    const supabase = await client();
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapComment);
  },

  async getComment(id) {
    const supabase = await client();
    const { data } = await supabase.from("comments").select("*").eq("id", id).maybeSingle();
    return data ? mapComment(data) : null;
  },

  async addComment(input) {
    const supabase = await client();
    const { data, error } = await supabase
      .from("comments")
      .insert({ project_id: input.projectId, author_id: input.authorId, text: input.text })
      .select()
      .single();
    if (error) throw error;
    return mapComment(data);
  },

  async deleteComment(id) {
    const supabase = await client();
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) throw error;
  },

  async listAttachments(relatedType: AttachmentRelatedType, relatedId: ID) {
    const supabase = await client();
    const { data, error } = await supabase
      .from("attachments")
      .select("*")
      .eq("related_type", relatedType)
      .eq("related_id", relatedId);
    if (error) throw error;
    return (data ?? []).map(mapAttachment);
  },

  async addAttachment(input) {
    const supabase = await client();
    const { data, error } = await supabase
      .from("attachments")
      .insert({
        related_type: input.relatedType,
        related_id: input.relatedId,
        file_url: input.fileUrl,
        caption: input.caption,
        uploaded_by_id: input.uploadedById,
      })
      .select()
      .single();
    if (error) throw error;
    return mapAttachment(data);
  },

  async getAttachmentUrl(fileUrl) {
    const supabase = await client();
    const { data, error } = await supabase.storage
      .from("attachments")
      .createSignedUrl(fileUrl, 3600);
    // Missing object (e.g. stale metadata pointing at a file that was never
    // actually uploaded, or one deleted directly from storage) shouldn't
    // crash the page -- just render that one attachment as unavailable.
    if (error) return null;
    return data.signedUrl;
  },

  async deleteAttachment(id) {
    const supabase = await client();
    const { error } = await supabase.from("attachments").delete().eq("id", id);
    if (error) throw error;
  },

  async listUsers() {
    const supabase = await client();
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return (data ?? []).map(mapUser);
  },

  async getUser(id) {
    const supabase = await client();
    const { data } = await supabase.from("users").select("*").eq("id", id).maybeSingle();
    return data ? mapUser(data) : null;
  },
};
