"use client";

import { useState } from "react";
import { BudgetHealthBar } from "@/components/dashboard/BudgetHealthBar";
import { BudgetForm } from "@/components/project-detail/ProjectBudgetCard";
import { Card } from "@/components/ui/Card";
import { updateBudgetAction } from "@/lib/actions/budgets";
import type { Budget } from "@/lib/data/types";

// Only project-scoped budgets are editable here, matching how the app
// treats a project's target budget as an owner-set figure -- property/area
// caps stay read-only on this overview.
export function BudgetRow({
  budget,
  label,
  committedCents,
  canEdit,
}: {
  budget: Budget;
  label: string;
  committedCents: number;
  canEdit: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const isEditable = canEdit && budget.relatedType === "project";

  return (
    <Card className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-heading text-lg font-semibold">{label}</h3>
        <span className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
          {budget.relatedType}
        </span>
      </div>
      {isEditing ? (
        <BudgetForm
          action={updateBudgetAction.bind(null, budget.id, budget.relatedId)}
          defaultLimitCents={budget.limitCents}
          defaultNotes={budget.notes}
          submitLabel="Save"
          onDone={() => setIsEditing(false)}
        />
      ) : (
        <>
          {budget.notes && <p className="text-sm text-ink-soft">{budget.notes}</p>}
          <BudgetHealthBar limitCents={budget.limitCents} committedCents={committedCents} />
          {isEditable && (
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
