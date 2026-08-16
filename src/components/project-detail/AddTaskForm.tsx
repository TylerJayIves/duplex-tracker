"use client";

import { useActionState } from "react";
import { createTaskAction } from "@/lib/actions/tasks";
import { Button } from "@/components/ui/button";
import { useCloseOnSuccess } from "@/components/shared/InlineDisclosure";
import type { ID } from "@/lib/data/types";

export function AddTaskForm({ projectId, close }: { projectId: ID; close: () => void }) {
  const boundAction = createTaskAction.bind(null, projectId);
  const [state, formAction, isPending] = useActionState(boundAction, undefined);

  useCloseOnSuccess(isPending, state, close);

  return (
    <form
      action={formAction}
      className="flex flex-wrap items-center gap-2 border border-border bg-paper-raised p-2"
    >
      <input
        type="text"
        name="title"
        required
        placeholder="New checklist item"
        className="min-w-0 flex-1 border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <input
        type="date"
        name="dueDate"
        className="border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Adding…" : "Add"}
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={close}>
        Cancel
      </Button>
      {state?.error && <p className="w-full text-xs text-brick">{state.error}</p>}
    </form>
  );
}
