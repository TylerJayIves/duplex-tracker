import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { CostItemRow } from "./CostItemRow";
import { AddCostItemDisclosure } from "./AddCostItemDisclosure";
import { formatCents } from "@/lib/format";
import type { CostItem, ID } from "@/lib/data/types";

export function CostItemsTable({
  costItems,
  projectId,
}: {
  costItems: CostItem[];
  projectId: ID;
}) {
  const estimatedTotal = costItems.reduce(
    (sum, c) => sum + c.estimatedCostCents,
    0
  );
  const actualTotal = costItems.reduce(
    (sum, c) => sum + (c.actualCostCents ?? 0),
    0
  );

  return (
    <div className="space-y-3">
      {costItems.length === 0 ? (
        <p className="text-sm text-ink-soft">No cost items logged yet.</p>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Item</Th>
              <Th>Category</Th>
              <Th>Estimated</Th>
              <Th>Actual</Th>
              <Th>Paid</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {costItems.map((item) => (
              <CostItemRow key={item.id} costItem={item} projectId={projectId} />
            ))}
          </Tbody>
          <tfoot>
            <Tr className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase">
              <Td>Total</Td>
              <Td />
              <Td className="tabular-nums">{formatCents(estimatedTotal)}</Td>
              <Td className="tabular-nums">{formatCents(actualTotal)}</Td>
              <Td />
              <Td />
            </Tr>
          </tfoot>
        </Table>
      )}
      <AddCostItemDisclosure projectId={projectId} />
    </div>
  );
}
