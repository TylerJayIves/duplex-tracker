import Link from "next/link";
import { Callout } from "@/components/ui/Callout";
import { reminderLabel } from "@/lib/domain/reminders";
import { formatCents, formatDate, daysUntil } from "@/lib/format";
import type {
  Contractor,
  Project,
  Quote,
  QuoteReminder,
} from "@/lib/data/types";

export function QuoteReminderCallout({
  reminder,
  quote,
  project,
  contractor,
}: {
  reminder: QuoteReminder;
  quote: Quote;
  project: Project;
  contractor: Contractor;
}) {
  const days = quote.validUntil ? daysUntil(quote.validUntil) : null;
  const tone =
    reminder.offsetDays === 3
      ? "brick"
      : reminder.offsetDays === 7
        ? "amber"
        : "accent";

  return (
    <Callout
      tone={tone}
      eyebrow={`${reminderLabel(reminder.offsetDays)} · expires ${quote.validUntil ? formatDate(quote.validUntil) : "—"}`}
      title={`${contractor.company} — ${formatCents(quote.amountCents)}`}
    >
      <Link href={`/projects/${project.id}`} className="hover:text-primary">
        {project.title}
      </Link>{" "}
      {days !== null &&
        (days >= 0
          ? `expires in ${days} day${days === 1 ? "" : "s"}.`
          : "has expired.")}
    </Callout>
  );
}
