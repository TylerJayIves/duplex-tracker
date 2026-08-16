import { QuoteCard } from "./QuoteCard";
import { AttachmentsList } from "./AttachmentsList";
import { AddQuoteDisclosure } from "./AddQuoteDisclosure";
import type { Contractor, ID, Quote } from "@/lib/data/types";

export function QuoteComparisonTable({
  quotes,
  contractors,
  projectId,
}: {
  quotes: Quote[];
  contractors: Contractor[];
  projectId: ID;
}) {
  const contractorById = new Map(contractors.map((c) => [c.id, c]));

  return (
    <div className="space-y-4">
      {quotes.length === 0 ? (
        <p className="text-sm text-ink-soft">No quotes collected yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {quotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              contractor={contractorById.get(quote.contractorId)}
              projectId={projectId}
              attachments={
                <AttachmentsList
                  relatedType="quote"
                  relatedId={quote.id}
                  projectId={projectId}
                />
              }
            />
          ))}
        </div>
      )}
      <AddQuoteDisclosure projectId={projectId} contractors={contractors} />
    </div>
  );
}
