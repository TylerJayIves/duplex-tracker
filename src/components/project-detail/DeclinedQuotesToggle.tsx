"use client";

import { useState } from "react";

// The declined quote cards are rendered by the (server) parent and passed in
// as children, because each card includes a server-only AttachmentsList.
// This component only decides whether to show them.
export function DeclinedQuotesToggle({
  count,
  children,
}: {
  count: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="font-mono text-xs tracking-wide text-ink-soft uppercase hover:text-primary"
      >
        {open
          ? `Hide declined quotes (${count})`
          : `Show declined quotes (${count})`}
      </button>
      {open && children}
    </div>
  );
}
