import { QuoteCard } from "./QuoteCard";
import { AttachmentsList } from "./AttachmentsList";
import { AddQuoteDisclosure } from "./AddQuoteDisclosure";
import { DeclinedQuotesToggle } from "./DeclinedQuotesToggle";
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
  const activeQuotes = quotes.filter((q) => q.status !== "declined");
  const declinedQuotes = quotes.filter((q) => q.status === "declined");

  const renderCards = (list: Quote[]) => (
    <div className="grid gap-4 sm:grid-cols-2">
      {list.map((quote) => (
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
  );

  return (
    <div className="space-y-4">
      {quotes.length === 0 ? (
        <p className="text-sm text-ink-soft">No quotes collected yet.</p>
      ) : activeQuotes.length > 0 ? (
        renderCards(activeQuotes)
      ) : (
        <p className="text-sm text-ink-soft">All quotes have been declined.</p>
      )}
      {declinedQuotes.length > 0 && (
        <DeclinedQuotesToggle count={declinedQuotes.length}>
          {renderCards(declinedQuotes)}
        </DeclinedQuotesToggle>
      )}
      <AddQuoteDisclosure projectId={projectId} contractors={contractors} />
    </div>
  );
}
