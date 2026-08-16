"use server";

import { revalidatePath } from "next/cache";
import { dataClient } from "@/lib/data";
import { parseCentsInput } from "@/lib/money";
import type { ID } from "@/lib/data/types";

export type AreaActionState = { error: string } | undefined;

export async function updateAreaAction(
  id: ID,
  _prevState: AreaActionState,
  formData: FormData
): Promise<AreaActionState> {
  const rentRaw = String(formData.get("targetRent") ?? "").trim();
  const targetRentCents = rentRaw ? parseCentsInput(rentRaw) : null;
  const targetReadyDate = String(formData.get("targetReadyDate") ?? "").trim() || null;

  if (rentRaw && targetRentCents === null) {
    return { error: "Enter a valid dollar amount." };
  }

  await dataClient.updateArea(id, { targetRentCents, targetReadyDate });
  revalidatePath("/");
  return undefined;
}
