"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteButton } from "@/components/shared/ConfirmDeleteButton";
import { updateTaskAction, deleteTaskAction } from "@/lib/actions/tasks";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import type { ID, Task } from "@/lib/data/types";

export function TaskRow({
  task,
  projectId,
  onToggle,
}: {
  task: Task;
  projectId: ID;
  onToggle: (task: Task) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <li>
        <EditTaskForm task={task} projectId={projectId} onDone={() => setIsEditing(false)} />
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3">
      <Checkbox id={task.id} checked={task.isDone} onCheckedChange={() => onToggle(task)} />
      <label
        htmlFor={task.id}
        className={cn(
          "flex-1 cursor-pointer text-sm",
          task.isDone && "text-ink-soft line-through"
        )}
      >
        {task.title}
      </label>
      {task.dueDate && (
        <span className="font-mono text-xs text-ink-soft">{formatDate(task.dueDate)}</span>
      )}
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase hover:text-primary"
      >
        Edit
      </button>
      <ConfirmDeleteButton
        action={deleteTaskAction.bind(null, task.id, projectId)}
        itemLabel="checklist item"
      />
    </li>
  );
}

function EditTaskForm({
  task,
  projectId,
  onDone,
}: {
  task: Task;
  projectId: ID;
  onDone: () => void;
}) {
  const boundAction = updateTaskAction.bind(null, task.id, projectId);
  const [state, formAction, isPending] = useActionState(boundAction, undefined);

  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !isPending && !state?.error) onDone();
    wasPending.current = isPending;
  }, [isPending, state, onDone]);

  return (
    <form
      action={formAction}
      className="flex flex-wrap items-center gap-2 border border-border bg-paper-raised p-2"
    >
      <input
        type="text"
        name="title"
        required
        defaultValue={task.title}
        className="min-w-0 flex-1 border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <input
        type="date"
        name="dueDate"
        defaultValue={task.dueDate ?? ""}
        className="border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Saving…" : "Save"}
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={onDone}>
        Cancel
      </Button>
      {state?.error && <p className="w-full text-xs text-brick">{state.error}</p>}
    </form>
  );
}
