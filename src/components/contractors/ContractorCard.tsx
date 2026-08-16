"use client";

import { useState } from "react";
import { EditContractorForm } from "./EditContractorForm";
import { ConfirmDeleteButton } from "@/components/shared/ConfirmDeleteButton";
import { deleteContractorAction } from "@/lib/actions/contractors";
import { Card } from "@/components/ui/Card";
import type { Contractor } from "@/lib/data/types";

export function ContractorCard({
  contractor,
  quoteCount,
}: {
  contractor: Contractor;
  quoteCount: number;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <Card className="space-y-2">
        <EditContractorForm
          contractor={contractor}
          onDone={() => setIsEditing(false)}
        />
      </Card>
    );
  }

  return (
    <Card className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-heading text-lg font-semibold">
            {contractor.company}
          </h3>
          <p className="text-sm text-ink-soft">
            {contractor.name} &middot; {contractor.trade}
          </p>
        </div>
        {contractor.rating != null && (
          <span className="font-mono text-xs text-amber">
            {contractor.rating.toFixed(1)}★
          </span>
        )}
      </div>
      <p className="font-mono text-xs text-ink-soft">
        {contractor.phone} &middot; {contractor.email}
      </p>
      {contractor.notes && (
        <p className="text-sm text-ink-soft">{contractor.notes}</p>
      )}
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-xs text-ink-soft">
          {quoteCount} quote{quoteCount === 1 ? "" : "s"} on file
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="font-mono text-[0.68rem] tracking-wide text-ink-soft uppercase hover:text-primary"
          >
            Edit
          </button>
          <ConfirmDeleteButton
            action={deleteContractorAction.bind(null, contractor.id)}
            itemLabel="contractor"
          />
        </div>
      </div>
    </Card>
  );
}
