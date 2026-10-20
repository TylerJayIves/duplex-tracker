import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import type { ActivityItem } from "@/lib/domain/dashboard";
import { avatarColor } from "@/lib/avatar-color";

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="border border-border bg-card p-4">
      <h3 className="mb-3 font-mono text-xs tracking-wide text-ink-soft uppercase">
        Recent activity
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-ink-soft">No activity yet.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[0.6rem] font-bold",
                  avatarColor(item.authorName) === "Tyler"
                    ? "bg-primary text-primary-foreground"
                    : avatarColor(item.authorName) === "Elle"
                      ? "bg-moss text-paper"
                      : "bg-ink-soft text-paper",
                )}
              >
                {item.authorName.charAt(0)}
              </span>
              <div className="min-w-0 text-sm">
                <p className="text-ink-soft">
                  <span className="font-semibold text-ink">
                    {item.authorName}
                  </span>{" "}
                  {item.kind === "comment"
                    ? "commented on"
                    : "uploaded a file to"}{" "}
                  <Link
                    href={`/projects/${item.projectId}`}
                    className="font-semibold text-ink hover:text-primary"
                  >
                    {item.projectTitle}
                  </Link>
                </p>
                {item.kind === "comment" ? (
                  <p className="mt-1 italic">&ldquo;{item.text}&rdquo;</p>
                ) : (
                  <span className="mt-1 inline-block bg-paper-raised px-2 py-0.5 font-mono text-xs text-ink-soft">
                    {item.filename}
                  </span>
                )}
                <p className="mt-1 font-mono text-[0.68rem] text-ink-soft/70">
                  {formatDate(item.when)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
