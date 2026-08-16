import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QuoteStatus } from "@/lib/data/types";

const OPTIONS: { value: QuoteStatus; label: string }[] = [
  { value: "requested", label: "Requested" },
  { value: "received", label: "Received" },
  { value: "accepted", label: "Accepted" },
  { value: "declined", label: "Declined" },
];

/** Uncontrolled variant for the full edit form -- see CostCategorySelect for why. */
export function QuoteStatusFormField({
  defaultValue = "requested",
}: {
  defaultValue?: QuoteStatus;
}) {
  return (
    <Select name="status" defaultValue={defaultValue}>
      <SelectTrigger size="sm" className="w-full">
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
