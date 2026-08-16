"use client";

import { useActionState, useEffect, useRef } from "react";
import { updateAreaAction } from "@/lib/actions/areas";
import { Button } from "@/components/ui/button";
import { centsToInputValue } from "@/lib/money";
import type { Area } from "@/lib/data/types";

export function EditAreaForm({ area, onDone }: { area: Area; onDone: () => void }) {
  const boundAction = updateAreaAction.bind(null, area.id);
  const [state, formAction, isPending] = useActionState(boundAction, undefined);

  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !isPending && !state?.error) onDone();
    wasPending.current = isPending;
  }, [isPending, state, onDone]);

  return (
    <form
      action={formAction}
      className="flex flex-wrap items-end gap-2 border border-border bg-paper-raised p-2"
    >
      <div className="space-y-1">
        <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
          Target rent
        </label>
        <input
          type="text"
          inputMode="decimal"
          name="targetRent"
          defaultValue={centsToInputValue(area.targetRentCents)}
          placeholder="0.00"
          className="w-24 border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <div className="space-y-1">
        <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
          Ready date
        </label>
        <input
          type="date"
          name="targetReadyDate"
          defaultValue={area.targetReadyDate ?? ""}
          className="border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
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
