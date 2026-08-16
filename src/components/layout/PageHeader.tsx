import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  action,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  meta?: { label: string; value: string }[];
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3 border-b-2 border-ink pb-6", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs tracking-wide text-primary uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-1 text-3xl font-bold">{title}</h1>
        </div>
        {action}
      </div>
      {description && (
        <p className="max-w-2xl text-sm text-ink-soft">{description}</p>
      )}
      {meta && meta.length > 0 && (
        <dl className="flex flex-wrap gap-x-6 gap-y-1 border-t border-border pt-3 font-mono text-xs text-ink-soft">
          {meta.map((m) => (
            <div key={m.label} className="flex gap-1.5">
              <dt className="tracking-wide uppercase">{m.label}:</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
