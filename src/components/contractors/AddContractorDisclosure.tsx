"use client";

import { InlineDisclosure } from "@/components/shared/InlineDisclosure";
import { AddContractorForm } from "./AddContractorForm";

// Same reasoning as AddQuoteDisclosure -- the render-prop composition has to
// happen entirely client-side since the contractors page is a Server
// Component.
export function AddContractorDisclosure() {
  return (
    <InlineDisclosure triggerLabel="+ Add contractor">
      {({ close }) => <AddContractorForm close={close} />}
    </InlineDisclosure>
  );
}
