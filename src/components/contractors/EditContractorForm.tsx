"use client";

import { useActionState, useEffect, useRef } from "react";
import { updateContractorAction } from "@/lib/actions/contractors";
import { Button } from "@/components/ui/button";
import type { Contractor } from "@/lib/data/types";

export function EditContractorForm({
  contractor,
  onDone,
}: {
  contractor: Contractor;
  onDone: () => void;
}) {
  const boundAction = updateContractorAction.bind(null, contractor.id);
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
            Name
          </label>
          <input
            type="text"
            name="name"
            required
            defaultValue={contractor.name}
            className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="space-y-1">
          <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
            Trade
          </label>
          <input
            type="text"
            name="trade"
            required
            defaultValue={contractor.trade}
            className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
            Company
          </label>
          <input
            type="text"
            name="company"
            defaultValue={contractor.company}
            className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="space-y-1">
          <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
            Rating
          </label>
          <input
            type="number"
            name="rating"
            min={0}
            max={5}
            step={0.1}
            defaultValue={contractor.rating ?? ""}
            className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            defaultValue={contractor.phone}
            className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="space-y-1">
          <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
            Email
          </label>
          <input
            type="email"
            name="email"
            defaultValue={contractor.email}
            className="w-full border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
          Notes
        </label>
        <textarea
          name="notes"
          rows={2}
          defaultValue={contractor.notes}
          className="w-full resize-none border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
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
