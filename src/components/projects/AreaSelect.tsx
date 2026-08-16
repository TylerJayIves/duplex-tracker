import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Area } from "@/lib/data/types";

/**
 * Uncontrolled, participates in the enclosing form's FormData via `name`.
 * Dynamic data -- the label lookup closes over the `areas` prop, which must
 * be fetched fresh by whoever renders this (same convention as
 * ContractorSelect).
 */
export function AreaSelect({
  areas,
  defaultValue,
}: {
  areas: Area[];
  defaultValue?: string;
}) {
  return (
    <Select name="areaId" defaultValue={defaultValue}>
      <SelectTrigger size="sm" className="w-full">
        <SelectValue placeholder="Choose an area">
          {(v: string) => areas.find((a) => a.id === v)?.name ?? "Unknown area"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {areas.map((a) => (
          <SelectItem key={a.id} value={a.id}>
            {a.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
