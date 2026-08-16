"use client";

import { useState, useTransition } from "react";

export function ConfirmDeleteButton({
  action,
  itemLabel,
  className,
}: {
  /** Already-bound server action, e.g. deleteCostItemAction.bind(null, costItem.id, projectId) */
  action: () => Promise<{ error: string } | undefined>;
  /** Used in the inline confirm prompt: "Delete this {itemLabel}?" */
  itemLabel: string;
  className?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <span className="flex shrink-0 flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className={
            className ??
            "font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase hover:text-brick"
          }
        >
          Delete
        </button>
        {error && (
          <span className="font-mono text-[0.68rem] tracking-wide text-brick normal-case">
            {error}
          </span>
        )}
      </span>
    );
  }

  return (
    <span className="flex shrink-0 flex-wrap items-center gap-2 font-mono text-[0.68rem] tracking-wide uppercase">
      <span className="text-ink-soft">Delete this {itemLabel}?</span>
      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const result = await action();
            if (result?.error) setError(result.error);
            setConfirming(false);
          })
        }
        className="text-brick hover:underline disabled:opacity-60"
      >
        {isPending ? "Deleting…" : "Confirm"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-ink-soft hover:underline"
      >
        Cancel
      </button>
    </span>
  );
}
