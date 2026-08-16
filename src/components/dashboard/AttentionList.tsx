"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { dismissAttentionItemAction } from "@/lib/actions/attention";
import { cn } from "@/lib/utils";
import type { AttentionItem } from "@/lib/domain/dashboard";

const TONE_CLASSES: Record<AttentionItem["tone"], { edge: string; eyebrow: string }> = {
  brick: { edge: "border-l-brick", eyebrow: "text-brick" },
  amber: { edge: "border-l-amber", eyebrow: "text-amber" },
};

export function AttentionList({ items }: { items: AttentionItem[] }) {
  // Optimistic on top of the server-filtered list: clicking dismiss hides
  // the card immediately instead of waiting on the round trip + revalidate.
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const visible = items.filter((item) => !dismissedIds.has(item.id));

  if (visible.length === 0) {
    return <p className="text-sm text-ink-soft">Nothing needs your attention right now.</p>;
  }

  return (
    <div className="space-y-3">
      {visible.map((item) => (
        <AttentionCard
          key={item.id}
          item={item}
          onDismiss={() =>
            setDismissedIds((prev) => {
              const next = new Set(prev);
              next.add(item.id);
              return next;
            })
          }
        />
      ))}
    </div>
  );
}

function AttentionCard({ item, onDismiss }: { item: AttentionItem; onDismiss: () => void }) {
  const [isPending, startTransition] = useTransition();
  const tone = TONE_CLASSES[item.tone];

  function handleDismiss() {
    onDismiss();
    startTransition(async () => {
      await dismissAttentionItemAction(item.id);
    });
  }

  return (
    <div
      className={cn(
        "relative rounded-sm border border-border border-l-4 bg-card p-4 pr-10 shadow-md",
        tone.edge
      )}
    >
      <button
        type="button"
        onClick={handleDismiss}
        disabled={isPending}
        aria-label="Dismiss"
        className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-paper-raised hover:text-ink disabled:opacity-50"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <p className={cn("font-mono text-[0.68rem] tracking-wide uppercase", tone.eyebrow)}>
        {item.tag}
      </p>
      <p className="mt-1 font-heading text-base font-semibold text-ink">{item.title}</p>
      <p className="mt-1 text-sm text-ink-soft">
        {item.projectId ? (
          <Link href={`/projects/${item.projectId}`} className="hover:text-primary">
            {item.meta}
          </Link>
        ) : (
          item.meta
        )}
      </p>
    </div>
  );
}
