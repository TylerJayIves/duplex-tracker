import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User } from "@/lib/data/types";

/**
 * Uncontrolled, participates in the enclosing form's FormData via `name`.
 * Dynamic data, same convention as AreaSelect/ContractorSelect.
 */
export function LeadSelect({
  users,
  defaultValue,
}: {
  users: User[];
  defaultValue?: string;
}) {
  return (
    <Select name="leadId" defaultValue={defaultValue}>
      <SelectTrigger size="sm" className="w-full">
        <SelectValue placeholder="Choose a lead">
          {(v: string) => users.find((u) => u.id === v)?.name ?? "Unknown"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {users.map((u) => (
          <SelectItem key={u.id} value={u.id}>
            {u.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
