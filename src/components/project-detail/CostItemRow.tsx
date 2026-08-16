"use client";

import { useState } from "react";
import { Tr, Td } from "@/components/ui/Table";
import { ConfirmDeleteButton } from "@/components/shared/ConfirmDeleteButton";
import { EditCostItemForm } from "./EditCostItemForm";
import { MarkCostItemPaidButton } from "./MarkCostItemPaidButton";
import { deleteCostItemAction } from "@/lib/actions/cost-items";
import { formatCents, formatDate } from "@/lib/format";
import type { CostItem, ID } from "@/lib/data/types";

const CATEGORY_LABEL: Record<CostItem["category"], string> = {
  materials: "Materials",
  labor: "Labor",
  permits: "Permits",
  other: "Other",
};

export function CostItemRow({
  costItem,
  projectId,
}: {
  costItem: CostItem;
  projectId: ID;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <Tr>
        <Td colSpan={6} className="p-0">
          <EditCostItemForm
            costItem={costItem}
            projectId={projectId}
            onDone={() => setIsEditing(false)}
          />
        </Td>
      </Tr>
    );
  }

  return (
    <Tr>
      <Td>{costItem.label}</Td>
      <Td className="text-ink-soft">{CATEGORY_LABEL[costItem.category]}</Td>
      <Td className="tabular-nums">{formatCents(costItem.estimatedCostCents)}</Td>
      <Td className="tabular-nums">
        {costItem.actualCostCents != null ? (
          formatCents(costItem.actualCostCents)
        ) : (
          <span className="text-ink-soft">—</span>
        )}
      </Td>
      <Td className="text-ink-soft">{formatDate(costItem.paidDate)}</Td>
      <Td>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {costItem.actualCostCents == null && (
            <MarkCostItemPaidButton costItemId={costItem.id} projectId={projectId} />
          )}
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase hover:text-primary"
          >
            Edit
          </button>
          <ConfirmDeleteButton
            action={deleteCostItemAction.bind(null, costItem.id, projectId)}
            itemLabel="cost item"
          />
        </div>
      </Td>
    </Tr>
  );
}
