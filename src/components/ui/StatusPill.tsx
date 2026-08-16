import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/lib/data/types";

const PROJECT_STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  idea: { label: "Idea", className: "bg-muted text-muted-foreground" },
  planned: { label: "Planned", className: "bg-accent text-accent-foreground" },
  in_progress: {
    label: "In Progress",
    className: "bg-primary/15 text-primary",
  },
  done: { label: "Done", className: "bg-moss-soft text-moss" },
  blocked: { label: "Blocked", className: "bg-brick-soft text-brick" },
};

function Pill({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center px-2 py-0.5 font-mono text-[0.68rem] tracking-wide uppercase",
        className
      )}
    >
      {label}
    </span>
  );
}

export function StatusPill({ status }: { status: ProjectStatus }) {
  const cfg = PROJECT_STATUS_CONFIG[status];
  return <Pill label={cfg.label} className={cfg.className} />;
}
