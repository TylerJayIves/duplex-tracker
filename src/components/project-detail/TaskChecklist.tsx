"use client";

import { useOptimistic, useTransition } from "react";
import { TaskRow } from "./TaskRow";
import { AddTaskForm } from "./AddTaskForm";
import { InlineDisclosure } from "@/components/shared/InlineDisclosure";
import { toggleTaskAction } from "@/lib/actions/tasks";
import type { Task } from "@/lib/data/types";

export function TaskChecklist({
  projectId,
  tasks,
}: {
  projectId: string;
  tasks: Task[];
}) {
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    tasks,
    (state, updated: { id: string; isDone: boolean }) =>
      state.map((t) => (t.id === updated.id ? { ...t, isDone: updated.isDone } : t))
  );
  const [, startTransition] = useTransition();

  function handleToggle(task: Task) {
    const isDone = !task.isDone;
    startTransition(async () => {
      setOptimisticTasks({ id: task.id, isDone });
      await toggleTaskAction(task.id, projectId, isDone);
    });
  }

  const doneCount = optimisticTasks.filter((t) => t.isDone).length;

  return (
    <div className="space-y-3">
      {optimisticTasks.length === 0 ? (
        <p className="text-sm text-ink-soft">No checklist items yet.</p>
      ) : (
        <>
          <p className="font-mono text-xs text-ink-soft">
            {doneCount} / {optimisticTasks.length} done
          </p>
          <ul className="space-y-2">
            {optimisticTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                projectId={projectId}
                onToggle={handleToggle}
              />
            ))}
          </ul>
        </>
      )}
      <InlineDisclosure triggerLabel="+ Add checklist item">
        {({ close }) => <AddTaskForm projectId={projectId} close={close} />}
      </InlineDisclosure>
    </div>
  );
}
