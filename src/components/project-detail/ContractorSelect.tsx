import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Contractor } from "@/lib/data/types";

/**
 * Uncontrolled, participates in the enclosing form's FormData via `name`.
 * Dynamic data (unlike CostCategorySelect's hardcoded options) -- the label
 * lookup closes over the `contractors` prop, which must be fetched fresh by
 * whoever renders this, not cached client-side, or a just-added contractor
 * won't show up here until the page is actually refetched.
 */
export function ContractorSelect({
  contractors,
  defaultValue,
}: {
  contractors: Contractor[];
  defaultValue?: string;
}) {
  return (
    <Select name="contractorId" defaultValue={defaultValue}>
      <SelectTrigger size="sm" className="w-full">
        <SelectValue placeholder="Choose a contractor">
          {(v: string) =>
            contractors.find((c) => c.id === v)?.company ?? "Unknown contractor"
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {contractors.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.company} ({c.name})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
