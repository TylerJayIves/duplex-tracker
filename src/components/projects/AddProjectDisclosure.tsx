"use client";

import { InlineDisclosure } from "@/components/shared/InlineDisclosure";
import { AddProjectForm } from "./AddProjectForm";
import type { Area, User } from "@/lib/data/types";

// Same reasoning as AddQuoteDisclosure/AddContractorDisclosure -- the
// render-prop composition has to happen entirely client-side since the
// projects page is a Server Component. No useCloseOnSuccess here: a
// successful submit redirects to the new project's detail page instead of
// closing back into this list.
export function AddProjectDisclosure({
  areas,
  users,
}: {
  areas: Area[];
  users: User[];
}) {
  return (
    <InlineDisclosure triggerLabel="+ Add project">
      {({ close }) => (
        <AddProjectForm areas={areas} users={users} close={close} />
      )}
    </InlineDisclosure>
  );
}
