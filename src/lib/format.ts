// Always shows cents -- this app stores/tracks costs to the cent (that's the
// whole reason everything's integer cents, not floats), and rounding the
// display to whole dollars would silently hide real precision from the user
// (e.g. a stored $19.99 rendering as "$20").
const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  month: "short",
  day: "numeric",
  year: "numeric",
});

// Tyler and Elle are both in Central time -- "today" for due dates, quote
// expiry, coming-up dates, etc. needs to follow their real calendar day, not
// UTC's. UTC runs 5-6 hours ahead of Central, so anything keyed off raw
// Date.now()/toISOString() flips to the next calendar day while it's still
// evening for them, making things look overdue or expired hours early.
// America/Chicago (not a fixed UTC-6 offset) so this stays correct across
// the CST/CDT switch.
const APP_TIMEZONE = "America/Chicago";
const TODAY_PARTS_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: APP_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function formatCents(cents: number): string {
  return CURRENCY_FORMATTER.format(cents / 100);
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return DATE_FORMATTER.format(new Date(dateStr));
}

/** Today's calendar date where Tyler and Elle actually are, as YYYY-MM-DD. */
export function todayISO(): string {
  const parts = TODAY_PARTS_FORMATTER.formatToParts(new Date());
  const year = parts.find((p) => p.type === "year")!.value;
  const month = parts.find((p) => p.type === "month")!.value;
  const day = parts.find((p) => p.type === "day")!.value;
  return `${year}-${month}-${day}`;
}

/** Whole days between today (Central time) and the given ISO date (can be negative if past). */
export function daysUntil(dateStr: string): number {
  const todayMs = new Date(`${todayISO()}T00:00:00Z`).getTime();
  const targetMs = new Date(`${dateStr}T00:00:00Z`).getTime();
  return Math.round((targetMs - todayMs) / (24 * 60 * 60 * 1000));
}
