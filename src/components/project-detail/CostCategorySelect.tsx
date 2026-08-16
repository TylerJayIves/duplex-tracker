import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CostCategory } from "@/lib/data/types";

const OPTIONS: { value: CostCategory; label: string }[] = [
  { value: "materials", label: "Materials" },
  { value: "labor", label: "Labor" },
  { value: "permits", label: "Permits" },
  { value: "other", label: "Other" },
];

/**
 * Uncontrolled -- participates in the enclosing form's FormData via `name`,
 * submitted together with the rest of the fields on Save/Add. No onChange
 * handler needed, unlike StatusSelect which calls its action directly.
 */
export function CostCategorySelect({
  defaultValue = "materials",
}: {
  defaultValue?: CostCategory;
}) {
  return (
    <Select name="category" defaultValue={defaultValue}>
      <SelectTrigger size="sm" className="w-full">
        <SelectValue>
          {(v: CostCategory) => OPTIONS.find((o) => o.value === v)?.label ?? v}
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
