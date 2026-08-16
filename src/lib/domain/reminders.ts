import type { QuoteReminder } from "@/lib/data/types";

export function reminderLabel(offsetDays: QuoteReminder["offsetDays"]): string {
  switch (offsetDays) {
    case 14:
      return "First nudge";
    case 7:
      return "Second nudge";
    case 3:
      return "Final nudge";
  }
}
