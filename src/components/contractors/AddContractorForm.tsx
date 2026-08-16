"use client";

import { useActionState } from "react";
import { createContractorAction } from "@/lib/actions/contractors";
import { Button } from "@/components/ui/button";
import { useCloseOnSuccess } from "@/components/shared/InlineDisclosure";

export function AddContractorForm({ close }: { close: () => void }) {
  const [state, formAction, isPending] = useActionState(
    createContractorAction,
    undefined
  );

  useCloseOnSuccess(isPending, state, close);

  return (
    <form
      action={formAction}
      className="space-y-2 border border-border bg-paper-raised p-3"
    >
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
            Name
          </label>
          <input
            type="text"
            name="name"
            required
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
            placeholder="Roofing, electrical, ..."
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
            placeholder="0-5"
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
          className="w-full resize-none border border-border bg-background px-2 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Adding…" : "Add contractor"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={close}>
          Cancel
        </Button>
        {state?.error && <p className="text-xs text-brick">{state.error}</p>}
      </div>
    </form>
  );
}
