"use client";

import { useActionState, useState } from "react";
import { markCostItemPaidAction } from "@/lib/actions/cost-items";
import { Button } from "@/components/ui/button";
import { useCloseOnSuccess } from "@/components/shared/InlineDisclosure";
import { todayISO } from "@/lib/format";
import type { ID } from "@/lib/data/types";

export function MarkCostItemPaidButton({
  costItemId,
  projectId,
}: {
  costItemId: ID;
  projectId: ID;
}) {
  const [open, setOpen] = useState(false);
  const boundAction = markCostItemPaidAction.bind(null, costItemId, projectId);
  const [state, formAction, isPending] = useActionState(boundAction, undefined);

  useCloseOnSuccess(isPending, state, () => setOpen(false));

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-mono text-[0.68rem] tracking-wide text-primary uppercase hover:underline"
      >
        Mark paid
      </button>
    );
  }

  return (
    <form
      action={formAction}
      className="flex flex-wrap items-center gap-2 border border-border bg-paper-raised p-2"
    >
      <input
        type="text"
        inputMode="decimal"
        name="actualCost"
        required
        placeholder="0.00"
        className="w-20 border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <input
        type="date"
        name="paidDate"
        defaultValue={todayISO()}
        className="border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Saving…" : "Save"}
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      {state?.error && <p className="w-full text-xs text-brick">{state.error}</p>}
    </form>
  );
}
