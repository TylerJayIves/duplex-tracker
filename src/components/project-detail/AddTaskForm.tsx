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
      className="flex flex-col gap-2 border border-border bg-paper-raised p-2 sm:flex-row sm:flex-wrap sm:items-center"
    >
      <input
        type="text"
        name="title"
        required
        placeholder="New checklist item"
        className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-auto sm:min-w-0 sm:flex-1"
      />
      <input
        type="date"
        name="dueDate"
        className="border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Adding…" : "Add"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={close}>
          Cancel
        </Button>
      </div>
      {state?.error && <p className="w-full text-xs text-brick">{state.error}</p>}
    </form>
  );
}
