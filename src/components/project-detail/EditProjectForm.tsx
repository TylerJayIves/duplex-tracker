"use client";

import { useActionState, useEffect, useRef } from "react";
import { updateProjectAction } from "@/lib/actions/projects";
import { PrioritySelect } from "@/components/projects/PrioritySelect";
import { LeadSelect } from "@/components/projects/LeadSelect";
import { Button } from "@/components/ui/button";
import type { Project, User } from "@/lib/data/types";

export function EditProjectForm({
  project,
  users,
  onDone,
}: {
  project: Project;
  users: User[];
  onDone: () => void;
}) {
  const boundAction = updateProjectAction.bind(null, project.id);
  const [state, formAction, isPending] = useActionState(boundAction, undefined);

  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !isPending && !state?.error) onDone();
    wasPending.current = isPending;
  }, [isPending, state, onDone]);

  return (
    <form action={formAction} className="space-y-2">
      <div className="space-y-1">
        <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
          Title
        </label>
        <input
          type="text"
          name="title"
          required
          defaultValue={project.title}
          className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <div className="space-y-1">
        <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
          Description
        </label>
        <textarea
          name="description"
          rows={2}
          defaultValue={project.description}
          className="w-full resize-none border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <div className="space-y-1">
        <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
          Lead
        </label>
        <LeadSelect key={project.leadId} users={users} defaultValue={project.leadId} />
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <div className="space-y-1">
          <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
            Priority
          </label>
          <PrioritySelect key={project.priority} defaultValue={project.priority} />
        </div>
        <div className="space-y-1">
          <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
            Start
          </label>
          <input
            type="date"
            name="startDate"
            defaultValue={project.startDate ?? ""}
            className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="space-y-1">
          <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
            Target
          </label>
          <input
            type="date"
            name="targetEndDate"
            defaultValue={project.targetEndDate ?? ""}
            className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Saving…" : "Save"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        {state?.error && <p className="text-xs text-brick">{state.error}</p>}
      </div>
    </form>
  );
}
