"use client";

import { useActionState, useEffect, useRef } from "react";
import { updateCostItemAction } from "@/lib/actions/cost-items";
import { CostCategorySelect } from "./CostCategorySelect";
import { Button } from "@/components/ui/button";
import { centsToInputValue } from "@/lib/money";
import type { CostItem, ID } from "@/lib/data/types";

export function EditCostItemForm({
  costItem,
  projectId,
  onDone,
}: {
  costItem: CostItem;
  projectId: ID;
  onDone: () => void;
}) {
  const boundAction = updateCostItemAction.bind(null, costItem.id, projectId);
  const [state, formAction, isPending] = useActionState(boundAction, undefined);

  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !isPending && !state?.error) onDone();
    wasPending.current = isPending;
  }, [isPending, state, onDone]);

  return (
    <form
      action={formAction}
      className="grid grid-cols-2 gap-3 border border-border bg-paper-raised p-3 sm:grid-cols-5"
    >
      <div className="space-y-1 sm:col-span-2">
        <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
          Label
        </label>
        <input
          type="text"
          name="label"
          required
          defaultValue={costItem.label}
          className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <div className="space-y-1">
        <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
          Category
        </label>
        {/* Keyed by the current value so a post-save revalidation (which can
        briefly update this prop before the parent unmounts this form) forces
        a fresh mount instead of an uncontrolled-defaultValue-changed warning. */}
        <CostCategorySelect key={costItem.category} defaultValue={costItem.category} />
      </div>
      <div className="space-y-1">
        <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
          Estimated
        </label>
        <input
          type="text"
          inputMode="decimal"
          name="estimatedCost"
          required
          defaultValue={centsToInputValue(costItem.estimatedCostCents)}
          className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <div className="space-y-1">
        <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
          Actual
        </label>
        <input
          type="text"
          inputMode="decimal"
          name="actualCost"
          placeholder="—"
          defaultValue={centsToInputValue(costItem.actualCostCents)}
          className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <div className="space-y-1">
        <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
          Paid
        </label>
        <input
          type="date"
          name="paidDate"
          defaultValue={costItem.paidDate ?? ""}
          className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <div className="flex items-end gap-2 sm:col-span-5">
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
