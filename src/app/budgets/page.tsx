import { dataClient } from "@/lib/data";
import { BudgetRow } from "@/components/budgets/BudgetRow";
import { getCurrentUser } from "@/lib/auth/current-user";
import type { Budget } from "@/lib/data/types";

async function resolveLabel(budget: Budget): Promise<string> {
  if (budget.relatedType === "property") {
    const property = await dataClient.getProperty();
    return property.address;
  }
  if (budget.relatedType === "area") {
    const area = await dataClient.getArea(budget.relatedId);
    return area?.name ?? "Unknown area";
  }
  const project = await dataClient.getProject(budget.relatedId);
  return project?.title ?? "Unknown project";
}

export default async function BudgetsPage() {
  const [budgets, currentUser] = await Promise.all([
    dataClient.listBudgets(),
    getCurrentUser(),
  ]);
  const canEdit = currentUser?.name === "Tyler";

  const rows = await Promise.all(
    budgets.map(async (budget) => ({
      budget,
      label: await resolveLabel(budget),
      spend: await dataClient.getBudgetSpend(budget.id),
    }))
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs tracking-wide text-primary uppercase">
          Budgets
        </p>
        <h1 className="mt-1 text-3xl font-bold">Budgets</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          Every cap currently set, at whatever level it applies — property,
          area, or project. The hard-stop override flow isn&apos;t wired up
          yet; this is just the current state.
        </p>
      </div>

      <div className="space-y-4">
        {rows.map(({ budget, label, spend }) => (
          <BudgetRow
            key={budget.id}
            budget={budget}
            label={label}
            committedCents={spend.committedCents}
            canEdit={canEdit}
          />
        ))}
      </div>
    </div>
  );
}
