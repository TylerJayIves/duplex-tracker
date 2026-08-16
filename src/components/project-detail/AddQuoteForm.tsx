"use client";

import { useActionState } from "react";
import { createQuoteAction } from "@/lib/actions/quotes";
import { ContractorSelect } from "./ContractorSelect";
import { Button } from "@/components/ui/button";
import { useCloseOnSuccess } from "@/components/shared/InlineDisclosure";
import type { Contractor, ID } from "@/lib/data/types";

export function AddQuoteForm({
  projectId,
  contractors,
  close,
}: {
  projectId: ID;
  contractors: Contractor[];
  close: () => void;
}) {
  const boundAction = createQuoteAction.bind(null, projectId);
  const [state, formAction, isPending] = useActionState(boundAction, undefined);

  useCloseOnSuccess(isPending, state, close);

  return (
    <form
      action={formAction}
      className="space-y-2 border border-border bg-paper-raised p-3"
    >
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
            Contractor
          </label>
          <ContractorSelect
            contractors={contractors}
            defaultValue={contractors[0]?.id}
          />
        </div>
        <div className="space-y-1">
          <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
            Amount
          </label>
          <input
            type="text"
            inputMode="decimal"
            name="amount"
            required
            placeholder="0.00"
            className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
          Scope
        </label>
        <textarea
          name="scopeDescription"
          required
          rows={2}
          placeholder="What does this quote cover?"
          className="w-full resize-none border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
            Received
          </label>
          <input
            type="date"
            name="receivedDate"
            className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="space-y-1">
          <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
            Valid until
          </label>
          <input
            type="date"
            name="validUntil"
            className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Adding…" : "Add quote"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={close}>
          Cancel
        </Button>
        {state?.error && <p className="text-xs text-brick">{state.error}</p>}
      </div>
    </form>
  );
}
