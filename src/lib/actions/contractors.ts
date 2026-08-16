"use server";

import { revalidatePath } from "next/cache";
import { dataClient } from "@/lib/data";
import type { ID } from "@/lib/data/types";

export type ContractorActionState = { error: string } | undefined;

const INVALID = Symbol("invalid-rating");

function parseRating(raw: FormDataEntryValue | null): number | null | typeof INVALID {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 5) return INVALID;
  return parsed;
}

export async function createContractorAction(
  _prevState: ContractorActionState,
  formData: FormData
): Promise<ContractorActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const trade = String(formData.get("trade") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const rating = parseRating(formData.get("rating"));

  if (!name) return { error: "Enter a name." };
  if (!trade) return { error: "Enter a trade." };
  if (rating === INVALID) return { error: "Rating must be a number between 0 and 5." };

  await dataClient.createContractor({
    name,
    trade,
    company,
    phone,
    email,
    notes,
    rating,
  });
  revalidatePath("/contractors");
  return undefined;
}

export async function updateContractorAction(
  id: ID,
  _prevState: ContractorActionState,
  formData: FormData
): Promise<ContractorActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const trade = String(formData.get("trade") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const rating = parseRating(formData.get("rating"));

  if (!name) return { error: "Enter a name." };
  if (!trade) return { error: "Enter a trade." };
  if (rating === INVALID) return { error: "Rating must be a number between 0 and 5." };

  await dataClient.updateContractor(id, {
    name,
    trade,
    company,
    phone,
    email,
    notes,
    rating,
  });
  revalidatePath("/contractors");
  return undefined;
}

export async function deleteContractorAction(
  id: ID
): Promise<{ error: string } | undefined> {
  try {
    await dataClient.deleteContractor(id);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Couldn't delete that — try again.",
    };
  }
  revalidatePath("/contractors");
  return undefined;
}
