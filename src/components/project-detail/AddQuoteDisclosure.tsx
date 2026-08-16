"use client";

import { InlineDisclosure } from "@/components/shared/InlineDisclosure";
import { AddQuoteForm } from "./AddQuoteForm";
import type { Contractor, ID } from "@/lib/data/types";

// Same reasoning as AddCostItemDisclosure -- the render-prop composition has
// to happen entirely client-side.
export function AddQuoteDisclosure({
  projectId,
  contractors,
}: {
  projectId: ID;
  contractors: Contractor[];
}) {
  return (
    <InlineDisclosure triggerLabel="+ Add quote">
      {({ close }) => (
        <AddQuoteForm projectId={projectId} contractors={contractors} close={close} />
      )}
    </InlineDisclosure>
  );
}
