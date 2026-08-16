"use server";

import { revalidatePath } from "next/cache";
import { dataClient } from "@/lib/data";
import type { ID } from "@/lib/data/types";

export type TaskActionState = { error: string } | undefined;

export async function toggleTaskAction(
  taskId: ID,
  projectId: ID,
  isDone: boolean
) {
  await dataClient.updateTask(taskId, { isDone });
  revalidatePath(`/projects/${projectId}`);
}

export async function createTaskAction(
  projectId: ID,
  _prevState: TaskActionState,
  formData: FormData
): Promise<TaskActionState> {
  const title = String(formData.get("title") ?? "").trim();
  const dueDate = String(formData.get("dueDate") ?? "").trim() || null;

  if (!title) return { error: "Enter a checklist item." };

  // Append after the highest existing order, not existing.length -- seed
  // data (and any list that's had items removed) isn't guaranteed to be
  // 0-indexed or gap-free, so length alone can collide with a real value.
  const existing = await dataClient.listTasks(projectId);
  const order = existing.reduce((max, t) => Math.max(max, t.order), 0) + 1;

  await dataClient.createTask({ projectId, title, order, dueDate });
  revalidatePath(`/projects/${projectId}`);
  return undefined;
}

export async function updateTaskAction(
  id: ID,
  projectId: ID,
  _prevState: TaskActionState,
  formData: FormData
): Promise<TaskActionState> {
  const title = String(formData.get("title") ?? "").trim();
  const dueDate = String(formData.get("dueDate") ?? "").trim() || null;

  if (!title) return { error: "Enter a checklist item." };

  await dataClient.updateTask(id, { title, dueDate });
  revalidatePath(`/projects/${projectId}`);
  return undefined;
}

export async function deleteTaskAction(
  id: ID,
  projectId: ID
): Promise<{ error: string } | undefined> {
  try {
    await dataClient.deleteTask(id);
  } catch {
    return { error: "Couldn't delete that — try again." };
  }
  revalidatePath(`/projects/${projectId}`);
  return undefined;
}
