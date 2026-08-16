"use server";

import { revalidatePath } from "next/cache";
import { dataClient } from "@/lib/data";
import { parseCentsInput } from "@/lib/money";
import type { CostCategory, ID } from "@/lib/data/types";

export type CostItemActionState = { error: string } | undefined;

const VALID_CATEGORIES: CostCategory[] = ["materials", "labor", "permits", "other"];

function parseCategory(raw: FormDataEntryValue | null): CostCategory | null {
  return typeof raw === "string" && VALID_CATEGORIES.includes(raw as CostCategory)
    ? (raw as CostCategory)
    : null;
}

export async function createCostItemAction(
  projectId: ID,
  _prevState: CostItemActionState,
  formData: FormData
): Promise<CostItemActionState> {
  const label = String(formData.get("label") ?? "").trim();
  const category = parseCategory(formData.get("category"));
  const estimatedCostCents = parseCentsInput(String(formData.get("estimatedCost") ?? ""));

  if (!label) return { error: "Enter a label for this cost item." };
  if (!category) return { error: "Choose a category." };
  if (estimatedCostCents === null) return { error: "Enter a valid dollar amount." };

  await dataClient.createCostItem({ projectId, label, category, estimatedCostCents });
  revalidatePath(`/projects/${projectId}`);
  return undefined;
}

export async function updateCostItemAction(
  id: ID,
  projectId: ID,
  _prevState: CostItemActionState,
  formData: FormData
): Promise<CostItemActionState> {
  const label = String(formData.get("label") ?? "").trim();
  const category = parseCategory(formData.get("category"));
  const estimatedCostCents = parseCentsInput(String(formData.get("estimatedCost") ?? ""));
  const actualRaw = String(formData.get("actualCost") ?? "").trim();
  const actualCostCents = actualRaw ? parseCentsInput(actualRaw) : null;
  const paidDate = String(formData.get("paidDate") ?? "").trim() || null;

  if (!label) return { error: "Enter a label for this cost item." };
  if (!category) return { error: "Choose a category." };
  if (estimatedCostCents === null) return { error: "Enter a valid dollar amount." };
  if (actualRaw && actualCostCents === null) {
    return { error: "Enter a valid dollar amount for actual cost." };
  }

  await dataClient.updateCostItem(id, {
    label,
    category,
    estimatedCostCents,
    actualCostCents,
    paidDate,
  });
  revalidatePath(`/projects/${projectId}`);
  return undefined;
}

export async function markCostItemPaidAction(
  id: ID,
  projectId: ID,
  _prevState: CostItemActionState,
  formData: FormData
): Promise<CostItemActionState> {
  const actualCostCents = parseCentsInput(String(formData.get("actualCost") ?? ""));
  const paidDate = String(formData.get("paidDate") ?? "").trim() || null;

  if (actualCostCents === null) return { error: "Enter a valid dollar amount." };

  await dataClient.updateCostItem(id, { actualCostCents, paidDate });
  revalidatePath(`/projects/${projectId}`);
  return undefined;
}

export async function deleteCostItemAction(
  id: ID,
  projectId: ID
): Promise<{ error: string } | undefined> {
  try {
    await dataClient.deleteCostItem(id);
  } catch {
    return { error: "Couldn't delete that — try again." };
  }
  revalidatePath(`/projects/${projectId}`);
  return undefined;
}
