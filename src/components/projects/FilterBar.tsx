"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Area, ProjectStatus } from "@/lib/data/types";

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "idea", label: "Idea" },
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
  { value: "blocked", label: "Blocked" },
];

export function FilterBar({ areas }: { areas: Area[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const area = searchParams.get("area") ?? "";
  const status = searchParams.get("status") ?? "";

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  const hasFilters = Boolean(area || status);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={area || "all"}
        onValueChange={(v) => setParam("area", v && v !== "all" ? v : "")}
      >
        <SelectTrigger size="sm">
          <SelectValue>
            {(v: string) =>
              v === "all" ? "All areas" : (areas.find((a) => a.id === v)?.name ?? "All areas")
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All areas</SelectItem>
          {areas.map((a) => (
            <SelectItem key={a.id} value={a.id}>
              {a.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={status || "all"}
        onValueChange={(v) => setParam("status", v && v !== "all" ? v : "")}
      >
        <SelectTrigger size="sm">
          <SelectValue>
            {(v: string) =>
              v === "all"
                ? "All statuses"
                : (STATUS_OPTIONS.find((s) => s.value === v)?.label ?? "All statuses")
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {STATUS_OPTIONS.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={() => router.push(pathname)}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
