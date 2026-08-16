import { dataClient } from "@/lib/data";
import { ContractorCard } from "@/components/contractors/ContractorCard";
import { AddContractorDisclosure } from "@/components/contractors/AddContractorDisclosure";

export default async function ContractorsPage() {
  const [contractors, quotes] = await Promise.all([
    dataClient.listContractors(),
    dataClient.listQuotes({}),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs tracking-wide text-primary uppercase">
          Contractors
        </p>
        <h1 className="mt-1 text-3xl font-bold">Contractors</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Everyone who&apos;s quoted work so far. Full contact management and
          quote-history filtering are coming later — for now, this is the
          roster.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {contractors.map((c) => {
          const quoteCount = quotes.filter((q) => q.contractorId === c.id).length;
          return (
            <ContractorCard key={c.id} contractor={c} quoteCount={quoteCount} />
          );
        })}
      </div>

      <AddContractorDisclosure />
    </div>
  );
}
