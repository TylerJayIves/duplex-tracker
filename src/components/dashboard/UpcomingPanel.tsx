import { formatDate } from "@/lib/format";
import type { UpcomingItem } from "@/lib/domain/dashboard";

export function UpcomingPanel({ items }: { items: UpcomingItem[] }) {
  return (
    <div className="border border-border bg-card p-4">
      <h3 className="mb-3 font-mono text-xs tracking-wide text-ink-soft uppercase">
        Coming up
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-ink-soft">No upcoming target dates.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3">
              <span className="w-14 shrink-0 font-mono text-xs text-primary">
                {formatDate(item.date)}
              </span>
              <div className="min-w-0">
                <p className="text-sm">{item.what}</p>
                <p className="text-xs text-ink-soft/70">{item.where}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
