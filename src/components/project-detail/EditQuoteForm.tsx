"use client";

import { useActionState, useEffect, useRef } from "react";
import { updateQuoteAction } from "@/lib/actions/quotes";
import { QuoteStatusFormField } from "./QuoteStatusFormField";
import { Button } from "@/components/ui/button";
import { centsToInputValue } from "@/lib/money";
import type { ID, Quote } from "@/lib/data/types";

export function EditQuoteForm({
  quote,
  projectId,
  onDone,
}: {
  quote: Quote;
  projectId: ID;
  onDone: () => void;
}) {
  const boundAction = updateQuoteAction.bind(null, quote.id, projectId);
  const [state, formAction, isPending] = useActionState(boundAction, undefined);

  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !isPending && !state?.error) onDone();
    wasPending.current = isPending;
  }, [isPending, state, onDone]);

  return (
    <form action={formAction} className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
            Amount
          </label>
          <input
            type="text"
            inputMode="decimal"
            name="amount"
            required
            defaultValue={centsToInputValue(quote.amountCents)}
            className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="space-y-1">
          <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
            Status
          </label>
          <QuoteStatusFormField key={quote.status} defaultValue={quote.status} />
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
          defaultValue={quote.scopeDescription}
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
            defaultValue={quote.receivedDate ?? ""}
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
            defaultValue={quote.validUntil ?? ""}
            className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
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
