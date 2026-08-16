"use server";

import { revalidatePath } from "next/cache";
import { dataClient } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth/current-user";

export async function dismissAttentionItemAction(
  itemId: string
): Promise<{ error: string } | undefined> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return { error: "Not signed in." };

  await dataClient.dismissAttentionItem(itemId, currentUser.id);
  revalidatePath("/");
  return undefined;
}
