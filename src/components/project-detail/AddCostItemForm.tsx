"use client";

import { useActionState } from "react";
import { createCostItemAction } from "@/lib/actions/cost-items";
import { CostCategorySelect } from "./CostCategorySelect";
import { Button } from "@/components/ui/button";
import { useCloseOnSuccess } from "@/components/shared/InlineDisclosure";
import type { ID } from "@/lib/data/types";

export function AddCostItemForm({
  projectId,
  close,
}: {
  projectId: ID;
  close: () => void;
}) {
  const boundAction = createCostItemAction.bind(null, projectId);
  const [state, formAction, isPending] = useActionState(boundAction, undefined);

  useCloseOnSuccess(isPending, state, close);

  return (
    <form
      action={formAction}
      className="flex flex-wrap items-end gap-2 border border-border bg-paper-raised p-3"
    >
      <div className="min-w-[10rem] flex-1 space-y-1">
        <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
          Label
        </label>
        <input
          type="text"
          name="label"
          required
          placeholder="e.g. Cabinet hardware"
          className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <div className="w-36 space-y-1">
        <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
          Category
        </label>
        <CostCategorySelect />
      </div>
      <div className="w-28 space-y-1">
        <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
          Estimated
        </label>
        <input
          type="text"
          inputMode="decimal"
          name="estimatedCost"
          required
          placeholder="0.00"
          className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Adding…" : "Add"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={close}>
          Cancel
        </Button>
      </div>
      {state?.error && (
        <p className="w-full text-xs text-brick">{state.error}</p>
      )}
    </form>
  );
}
