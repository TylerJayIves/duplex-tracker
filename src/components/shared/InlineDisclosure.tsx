"use client";

import { useEffect, useRef, useState } from "react";

export function InlineDisclosure({
  triggerLabel,
  children,
  className,
}: {
  triggerLabel: string;
  children: (opts: { close: () => void }) => React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "font-mono text-xs tracking-wide text-primary uppercase hover:underline"
        }
      >
        {triggerLabel}
      </button>
    );
  }

  return <>{children({ close: () => setOpen(false) })}</>;
}

/**
 * Closes an InlineDisclosure once a useActionState-backed form finishes a
 * successful submit. useActionState's state is `undefined` both before the
 * first submit and after a successful one, so success can't be read from
 * state alone -- this watches the pending->idle transition instead.
 */
export function useCloseOnSuccess(
  isPending: boolean,
  state: { error: string } | undefined,
  close: () => void
) {
  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !isPending && !state?.error) {
      close();
    }
    wasPending.current = isPending;
  }, [isPending, state, close]);
}
