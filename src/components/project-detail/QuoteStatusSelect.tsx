"use client";

import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { updateQuoteStatusAction } from "@/lib/actions/quotes";
import type { ID, QuoteStatus } from "@/lib/data/types";

const OPTIONS: { value: QuoteStatus; label: string }[] = [
  { value: "requested", label: "Requested" },
  { value: "received", label: "Received" },
  { value: "accepted", label: "Accepted" },
  { value: "declined", label: "Declined" },
];

export function QuoteStatusSelect({
  quoteId,
  projectId,
  status,
}: {
  quoteId: ID;
  projectId: ID;
  status: QuoteStatus;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={status}
      onValueChange={(value) => {
        if (!value) return;
        startTransition(() =>
          updateQuoteStatusAction(quoteId, projectId, value as QuoteStatus)
        );
      }}
    >
      <SelectTrigger size="sm" className={cn(isPending && "opacity-60")}>
        <SelectValue>
          {(v: QuoteStatus) => OPTIONS.find((o) => o.value === v)?.label ?? v}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
