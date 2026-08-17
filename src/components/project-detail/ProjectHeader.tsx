"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusSelect } from "./StatusSelect";
import { EditProjectForm } from "./EditProjectForm";
import { ConfirmDeleteButton } from "@/components/shared/ConfirmDeleteButton";
import { deleteProjectAction } from "@/lib/actions/projects";
import { formatDate } from "@/lib/format";
import { projectColorConfig } from "@/lib/project-colors";
import { cn } from "@/lib/utils";
import type { Area, Project, User } from "@/lib/data/types";

export function ProjectHeader({
  project,
  area,
  lead,
  users,
}: {
  project: Project;
  area: Area | null;
  lead: User | null;
  users: User[];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const color = projectColorConfig(project.color);

  return (
    <div className="space-y-3">
      {area && (
        <Link
          href={`/projects?area=${area.id}`}
          className="font-mono text-xs tracking-wide text-primary uppercase hover:underline"
        >
          {area.name}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        {isEditing ? (
          <span className="font-mono text-xs tracking-wide text-ink-soft uppercase">
            Editing project…
          </span>
        ) : (
          <h1 className="flex items-center gap-3 text-3xl font-bold">
            {color && (
              <span
                className={cn("h-3 w-3 shrink-0 rounded-full", color.dot)}
                aria-hidden="true"
              />
            )}
            {project.title}
          </h1>
        )}
        <StatusSelect projectId={project.id} status={project.status} />
      </div>

      {isEditing ? (
        <EditProjectForm
          project={project}
          users={users}
          onDone={() => setIsEditing(false)}
        />
      ) : (
        <>
          <p className="max-w-2xl text-sm text-ink-soft">{project.description}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-xs text-ink-soft">
            <span>Lead: {lead?.name ?? "Unassigned"}</span>
            <span>Priority: {project.priority}</span>
            <span>Start: {formatDate(project.startDate)}</span>
            <span>Target: {formatDate(project.targetEndDate)}</span>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="tracking-wide text-ink-soft uppercase hover:text-primary"
            >
              Edit
            </button>
            <ConfirmDeleteButton
              action={deleteProjectAction.bind(null, project.id)}
              itemLabel="project (this also removes its tasks, cost items, quotes, comments, and attachments)"
              className="tracking-wide text-ink-soft uppercase hover:text-brick"
            />
          </div>
        </>
      )}
    </div>
  );
}
