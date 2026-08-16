"use server";

import { revalidatePath } from "next/cache";
import { dataClient } from "@/lib/data";
import { parseCentsInput } from "@/lib/money";
import type { ID, QuoteStatus } from "@/lib/data/types";

export type QuoteActionState = { error: string } | undefined;

const VALID_STATUSES: QuoteStatus[] = ["requested", "received", "accepted", "declined"];

function parseStatus(raw: FormDataEntryValue | null): QuoteStatus | null {
  return typeof raw === "string" && VALID_STATUSES.includes(raw as QuoteStatus)
    ? (raw as QuoteStatus)
    : null;
}

export async function createQuoteAction(
  projectId: ID,
  _prevState: QuoteActionState,
  formData: FormData
): Promise<QuoteActionState> {
  const contractorId = String(formData.get("contractorId") ?? "").trim();
  const amountCents = parseCentsInput(String(formData.get("amount") ?? ""));
  const scopeDescription = String(formData.get("scopeDescription") ?? "").trim();
  const receivedDate = String(formData.get("receivedDate") ?? "").trim() || null;
  const validUntil = String(formData.get("validUntil") ?? "").trim() || null;

  if (!contractorId) return { error: "Choose a contractor." };
  if (amountCents === null) return { error: "Enter a valid dollar amount." };
  if (!scopeDescription) return { error: "Describe what this quote covers." };

  await dataClient.createQuote({
    projectId,
    contractorId,
    amountCents,
    scopeDescription,
    receivedDate,
    validUntil,
  });
  revalidatePath(`/projects/${projectId}`);
  return undefined;
}

export async function updateQuoteAction(
  id: ID,
  projectId: ID,
  _prevState: QuoteActionState,
  formData: FormData
): Promise<QuoteActionState> {
  const amountCents = parseCentsInput(String(formData.get("amount") ?? ""));
  const scopeDescription = String(formData.get("scopeDescription") ?? "").trim();
  const status = parseStatus(formData.get("status"));
  const receivedDate = String(formData.get("receivedDate") ?? "").trim() || null;
  const validUntil = String(formData.get("validUntil") ?? "").trim() || null;

  if (amountCents === null) return { error: "Enter a valid dollar amount." };
  if (!scopeDescription) return { error: "Describe what this quote covers." };
  if (!status) return { error: "Choose a status." };

  await dataClient.updateQuote(id, {
    amountCents,
    scopeDescription,
    status,
    receivedDate,
    validUntil,
  });
  revalidatePath(`/projects/${projectId}`);
  return undefined;
}

export async function updateQuoteStatusAction(
  id: ID,
  projectId: ID,
  status: QuoteStatus
) {
  await dataClient.updateQuote(id, { status });
  revalidatePath(`/projects/${projectId}`);
}

export async function deleteQuoteAction(
  id: ID,
  projectId: ID
): Promise<{ error: string } | undefined> {
  try {
    await dataClient.deleteQuote(id);
  } catch {
    return { error: "Couldn't delete that — try again." };
  }
  revalidatePath(`/projects/${projectId}`);
  return undefined;
}
