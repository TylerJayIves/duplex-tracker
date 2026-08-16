"use server";

import { revalidatePath } from "next/cache";
import { dataClient } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth/current-user";
import { parseCentsInput } from "@/lib/money";
import type { ID } from "@/lib/data/types";

export type BudgetActionState = { error: string } | undefined;

// Budget caps are a household-finance decision, not a day-to-day project
// edit -- restricted to Tyler specifically rather than either signed-in user,
// same "far more steps than a normal edit" spirit as the area-deletion
// guardrail, just enforced via a narrower audience instead of extra steps.
async function requireTyler(): Promise<{ error: string } | undefined> {
  const user = await getCurrentUser();
  if (!user) return { error: "Not signed in." };
  if (user.name !== "Tyler") return { error: "Only Tyler can change budgets." };
  return undefined;
}

export async function createProjectBudgetAction(
  projectId: ID,
  _prevState: BudgetActionState,
  formData: FormData
): Promise<BudgetActionState> {
  const authError = await requireTyler();
  if (authError) return authError;

  const limitCents = parseCentsInput(String(formData.get("limitCents") ?? ""));
  const notes = String(formData.get("notes") ?? "").trim();
  if (limitCents === null) return { error: "Enter a valid dollar amount." };

  await dataClient.createBudget({
    relatedType: "project",
    relatedId: projectId,
    limitCents,
    notes,
  });
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/budgets");
  revalidatePath("/");
  return undefined;
}

export async function updateBudgetAction(
  budgetId: ID,
  projectId: ID,
  _prevState: BudgetActionState,
  formData: FormData
): Promise<BudgetActionState> {
  const authError = await requireTyler();
  if (authError) return authError;

  const limitCents = parseCentsInput(String(formData.get("limitCents") ?? ""));
  const notes = String(formData.get("notes") ?? "").trim();
  if (limitCents === null) return { error: "Enter a valid dollar amount." };

  await dataClient.updateBudget(budgetId, { limitCents, notes });
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/budgets");
  revalidatePath("/");
  return undefined;
}
