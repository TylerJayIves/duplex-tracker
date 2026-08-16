"use server";

import { revalidatePath } from "next/cache";
import { dataClient } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth/current-user";
import type { ID } from "@/lib/data/types";

export async function addCommentAction(
  projectId: ID,
  authorId: ID,
  text: string
) {
  const trimmed = text.trim();
  if (!trimmed) return;
  await dataClient.addComment({ projectId, authorId, text: trimmed });
  revalidatePath(`/projects/${projectId}`);
}

export async function deleteCommentAction(
  id: ID,
  projectId: ID
): Promise<{ error: string } | undefined> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return { error: "Not signed in." };

  const comment = await dataClient.getComment(id);
  if (!comment) return { error: "Comment not found." };
  if (comment.authorId !== currentUser.id) {
    return { error: "You can only delete your own comments." };
  }

  await dataClient.deleteComment(id);
  revalidatePath(`/projects/${projectId}`);
  return undefined;
}
