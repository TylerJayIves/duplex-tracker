import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProjectPriority } from "@/lib/data/types";

const OPTIONS: { value: ProjectPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

/**
 * Uncontrolled -- participates in the enclosing form's FormData via `name`,
 * same convention as CostCategorySelect.
 */
export function PrioritySelect({
  defaultValue = "medium",
}: {
  defaultValue?: ProjectPriority;
}) {
  return (
    <Select name="priority" defaultValue={defaultValue}>
      <SelectTrigger size="sm" className="w-full">
        <SelectValue>
          {(v: ProjectPriority) => OPTIONS.find((o) => o.value === v)?.label ?? v}
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
