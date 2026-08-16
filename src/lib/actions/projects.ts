"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { dataClient } from "@/lib/data";
import type { ID, ProjectPriority, ProjectStatus } from "@/lib/data/types";

export type ProjectActionState = { error: string } | undefined;

const VALID_PRIORITIES: ProjectPriority[] = ["low", "medium", "high"];

function parsePriority(raw: FormDataEntryValue | null): ProjectPriority | null {
  return typeof raw === "string" && VALID_PRIORITIES.includes(raw as ProjectPriority)
    ? (raw as ProjectPriority)
    : null;
}

export async function createProjectAction(
  _prevState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  const areaId = String(formData.get("areaId") ?? "").trim();
  const leadId = String(formData.get("leadId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priority = parsePriority(formData.get("priority")) ?? "medium";
  const startDate = String(formData.get("startDate") ?? "").trim() || null;
  const targetEndDate = String(formData.get("targetEndDate") ?? "").trim() || null;

  if (!areaId) return { error: "Choose an area." };
  if (!leadId) return { error: "Choose a lead." };
  if (!title) return { error: "Enter a title." };
  if (!category) return { error: "Enter a category." };

  let project;
  try {
    project = await dataClient.createProject({
      areaId,
      leadId,
      title,
      category,
      description,
      priority,
      startDate,
      targetEndDate,
    });
  } catch {
    return { error: "Couldn't create project. Try again." };
  }

  // redirect() throws internally -- must stay outside the try/catch above,
  // or a successful creation gets reported back as a failure.
  redirect(`/projects/${project.id}`);
}

export async function updateProjectAction(
  id: ID,
  _prevState: ProjectActionState,
  formData: FormData
): Promise<ProjectActionState> {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priority = parsePriority(formData.get("priority"));
  const startDate = String(formData.get("startDate") ?? "").trim() || null;
  const targetEndDate = String(formData.get("targetEndDate") ?? "").trim() || null;
  const leadId = String(formData.get("leadId") ?? "").trim();

  if (!title) return { error: "Enter a title." };
  if (!priority) return { error: "Choose a priority." };
  if (!leadId) return { error: "Choose a lead." };

  await dataClient.updateProject(id, {
    title,
    description,
    priority,
    startDate,
    targetEndDate,
    leadId,
  });
  revalidatePath(`/projects/${id}`);
  return undefined;
}

export async function updateProjectStatusAction(id: ID, status: ProjectStatus) {
  await dataClient.updateProjectStatus(id, status);
  revalidatePath(`/projects/${id}`);
}

export async function deleteProjectAction(
  id: ID
): Promise<{ error: string } | undefined> {
  try {
    await dataClient.deleteProject(id);
  } catch {
    return { error: "Couldn't delete that — try again." };
  }

  // redirect() throws internally -- must stay outside the try/catch above,
  // or a successful deletion gets reported back as a failure. There's no
  // page left to revalidate (the project is gone), so this always redirects
  // rather than returning to a stale detail page.
  redirect("/projects");
}
