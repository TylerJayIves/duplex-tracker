"use client";

import { useActionState } from "react";
import { createProjectAction } from "@/lib/actions/projects";
import { AreaSelect } from "./AreaSelect";
import { LeadSelect } from "./LeadSelect";
import { PrioritySelect } from "./PrioritySelect";
import { ProjectColorSelect } from "./ProjectColorSelect";
import { Button } from "@/components/ui/button";
import type { Area, User } from "@/lib/data/types";

export function AddProjectForm({
  areas,
  users,
  close,
}: {
  areas: Area[];
  users: User[];
  close: () => void;
}) {
  const [state, formAction, isPending] = useActionState(
    createProjectAction,
    undefined
  );

  return (
    <form
      action={formAction}
      className="space-y-2 border border-border bg-paper-raised p-3"
    >
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
            Title
          </label>
          <input
            type="text"
            name="title"
            required
            className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="space-y-1">
          <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
            Category
          </label>
          <input
            type="text"
            name="category"
            required
            placeholder="Kitchen, Roofing, ..."
            className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
            Area
          </label>
          <AreaSelect areas={areas} defaultValue={areas[0]?.id} />
        </div>
        <div className="space-y-1">
          <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
            Lead
          </label>
          <LeadSelect users={users} defaultValue={users[0]?.id} />
        </div>
      </div>
      <div className="space-y-1">
        <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
          Description
        </label>
        <textarea
          name="description"
          rows={2}
          className="w-full resize-none border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <div className="space-y-1">
          <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
            Priority
          </label>
          <PrioritySelect />
        </div>
        <div className="space-y-1">
          <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
            Start
          </label>
          <input
            type="date"
            name="startDate"
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
            className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
          Color
        </label>
        <ProjectColorSelect />
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Creating…" : "Create project"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={close}>
          Cancel
        </Button>
        {state?.error && <p className="text-xs text-brick">{state.error}</p>}
      </div>
    </form>
  );
}
