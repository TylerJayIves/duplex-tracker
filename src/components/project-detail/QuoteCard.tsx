"use client";

import { useState } from "react";
import { QuoteStatusSelect } from "./QuoteStatusSelect";
import { EditQuoteForm } from "./EditQuoteForm";
import { ConfirmDeleteButton } from "@/components/shared/ConfirmDeleteButton";
import { deleteQuoteAction } from "@/lib/actions/quotes";
import { formatCents, formatDate } from "@/lib/format";
import type { Contractor, ID, Quote } from "@/lib/data/types";

export function QuoteCard({
  quote,
  contractor,
  projectId,
  attachments,
}: {
  quote: Quote;
  contractor: Contractor | undefined;
  projectId: ID;
  // Pre-rendered by the (server) parent -- AttachmentsList does its own
  // server-only data fetching, so it can't be imported directly into this
  // client component; it's passed down as already-rendered content instead.
  attachments: React.ReactNode;
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div data-slot="quote-card" className="border border-border p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-heading font-semibold">
            {contractor?.company ?? "Unknown contractor"}
          </p>
          <p className="text-xs text-ink-soft">{contractor?.name}</p>
        </div>
        <QuoteStatusSelect
          quoteId={quote.id}
          projectId={projectId}
          status={quote.status}
        />
      </div>

      {isEditing ? (
        <div className="mt-3">
          <EditQuoteForm
            quote={quote}
            projectId={projectId}
            onDone={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <>
          <p className="mt-3 font-mono text-2xl tabular-nums">
            {formatCents(quote.amountCents)}
          </p>
          <p className="mt-2 text-sm text-ink-soft">{quote.scopeDescription}</p>
          <p className="mt-3 font-mono text-xs text-ink-soft">
            {quote.validUntil
              ? `Valid until ${formatDate(quote.validUntil)}`
              : "No expiry set"}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase hover:text-primary"
            >
              Edit
            </button>
            <ConfirmDeleteButton
              action={deleteQuoteAction.bind(null, quote.id, projectId)}
              itemLabel="quote"
            />
          </div>
        </>
      )}

      <div className="mt-4 border-t border-border pt-3">{attachments}</div>
    </div>
  );
}
