import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { formatCents } from "@/lib/format";
import type { Contractor } from "@/lib/data/types";

export function ContractorStrip({
  contractors,
}: {
  contractors: Array<{
    contractor: Contractor;
    quoteCount: number;
    totalCents: number;
  }>;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {contractors.map(({ contractor, quoteCount, totalCents }) => (
        <Card key={contractor.id} className="space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <p className="font-heading font-semibold">
                {contractor.company || contractor.name}
              </p>
              <p className="text-xs text-ink-soft">
                {contractor.name} &middot; {contractor.trade}
              </p>
            </div>
            {contractor.rating != null && (
              <span className="font-mono text-xs text-amber">
                &#9733; {contractor.rating.toFixed(1)}
              </span>
            )}
          </div>
          <div className="flex items-baseline justify-between font-mono text-xs text-ink-soft">
            <span>
              {quoteCount} quote{quoteCount === 1 ? "" : "s"} on file
            </span>
            {quoteCount > 0 && <span className="tabular-nums">{formatCents(totalCents)}</span>}
          </div>
        </Card>
      ))}
      <Link
        href="/contractors"
        className="flex min-h-[84px] items-center justify-center border border-dashed border-border font-mono text-xs tracking-wide text-ink-soft uppercase hover:border-primary hover:text-primary"
      >
        + Add contractor
      </Link>
    </div>
  );
}
