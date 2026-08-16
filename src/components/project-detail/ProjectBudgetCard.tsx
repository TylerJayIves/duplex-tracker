"use client";

import { useActionState, useState } from "react";
import { BudgetHealthBar } from "@/components/dashboard/BudgetHealthBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { useCloseOnSuccess } from "@/components/shared/InlineDisclosure";
import { centsToInputValue } from "@/lib/money";
import {
  createProjectBudgetAction,
  updateBudgetAction,
} from "@/lib/actions/budgets";
import type { ID } from "@/lib/data/types";

const FIELD_CLASS =
  "w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
const LABEL_CLASS = "font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase";

export function ProjectBudgetCard({
  projectId,
  budget,
  committedCents,
  canEdit,
}: {
  projectId: ID;
  budget: { id: ID; limitCents: number; notes: string } | null;
  committedCents: number;
  canEdit: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (!budget) {
    if (!canEdit) return null;
    return (
      <Card>
        {isEditing ? (
          <BudgetForm
            action={createProjectBudgetAction.bind(null, projectId)}
            submitLabel="Set budget"
            onDone={() => setIsEditing(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="font-mono text-xs tracking-wide text-primary uppercase hover:underline"
          >
            + Set a project budget
          </button>
        )}
      </Card>
    );
  }

  return (
    <Card className="space-y-2">
      {isEditing ? (
        <BudgetForm
          action={updateBudgetAction.bind(null, budget.id, projectId)}
          defaultLimitCents={budget.limitCents}
          defaultNotes={budget.notes}
          submitLabel="Save"
          onDone={() => setIsEditing(false)}
        />
      ) : (
        <>
          <BudgetHealthBar
            limitCents={budget.limitCents}
            committedCents={committedCents}
            label="Project budget"
          />
          {budget.notes && <p className="text-sm text-ink-soft">{budget.notes}</p>}
          {canEdit && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase hover:text-primary"
            >
              Edit
            </button>
          )}
        </>
      )}
    </Card>
  );
}

export function BudgetForm({
  action,
  defaultLimitCents,
  defaultNotes,
  submitLabel,
  onDone,
}: {
  action: (
    prevState: { error: string } | undefined,
    formData: FormData
  ) => Promise<{ error: string } | undefined>;
  defaultLimitCents?: number;
  defaultNotes?: string;
  submitLabel: string;
  onDone: () => void;
}) {
  const [state, formAction, isPending] = useActionState(action, undefined);
  useCloseOnSuccess(isPending, state, onDone);

  return (
    <form action={formAction} className="space-y-2">
      <div className="space-y-1">
        <label className={LABEL_CLASS}>Budget cap</label>
        <input
          type="text"
          inputMode="decimal"
          name="limitCents"
          required
          defaultValue={centsToInputValue(defaultLimitCents ?? null)}
          placeholder="0.00"
          className={FIELD_CLASS}
        />
      </div>
      <div className="space-y-1">
        <label className={LABEL_CLASS}>Notes</label>
        <textarea
          name="notes"
          rows={2}
          defaultValue={defaultNotes}
          className={`${FIELD_CLASS} resize-none`}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Saving…" : submitLabel}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        {state?.error && <p className="text-xs text-brick">{state.error}</p>}
      </div>
    </form>
  );
}
