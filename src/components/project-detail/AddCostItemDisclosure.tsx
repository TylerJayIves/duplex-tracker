"use client";

import { InlineDisclosure } from "@/components/shared/InlineDisclosure";
import { AddCostItemForm } from "./AddCostItemForm";
import type { ID } from "@/lib/data/types";

// Thin client wrapper so the render-prop composition (a function passed as
// InlineDisclosure's children) happens entirely client-side -- a Server
// Component can't pass a function across the RSC boundary as children/props,
// only serializable data, so this can't be inlined directly into the
// (server) CostItemsTable.
export function AddCostItemDisclosure({ projectId }: { projectId: ID }) {
  return (
    <InlineDisclosure triggerLabel="+ Add cost item">
      {({ close }) => <AddCostItemForm projectId={projectId} close={close} />}
    </InlineDisclosure>
  );
}
